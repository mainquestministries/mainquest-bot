import { days_of_week } from '#lib/constants';
import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ActionRowBuilder, APIEmbed, Interaction, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from 'discord.js';
const prisma = new PrismaClient();

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener {
	public async run(interaction: Interaction) {
		if (interaction.isButton()) {
			if (interaction.customId.startsWith('abo_')) {
				// Abo
				if (
					(await prisma.message.count({
						where: { id: interaction.user.id }
					})) === 0
				) {
					const userconfig = await prisma.message.create({
						data: {
							id: interaction.user.id
						}
					});
					const weeks_ = userconfig.repetitions / days_of_week[userconfig.modulo];
					const week_string = weeks_ == 1 ? 'eine Woche' : `${weeks_} Wochen`;
					const introduction = await interaction.user.send({
						content: `Hi. Es ist meine Ehre an deinem Gedächtnis anzuklopfen und dich ${days_of_week[userconfig.modulo]}x pro Woche an die Gebetsanliegen zu erinnern, und dies pro Anliegen ${week_string} lang.
Falls du häufiger Erinnerungen erhalten möchtest, oder wenn ich dir zu nervig bin:
Folge den Folgenden Anweisungen und ich erscheine dann nach deinen Einstellungen.`,
						embeds: [
							{
								title: 'Kurzanleitung',
								description: 'Du kannst jederzeit die Benachrichtigungen mithilfe von Slashcommands deaktivieren oder reduzieren.',
								fields: [
									{
										name: '/Benachrichtigungen_aktivieren',
										value: 'Aktiviert deine Benachrichtigungen (falls du diese deaktiviert hast)'
									},
									{
										name: '/Benachrichtigungen_deaktivieren',
										value: 'Deaktiviert deine Benachrichtigungen dauerhaft bis zum Einschalten.'
									},
									{
										name: '/Benachrichtigungen_einstellen',
										value: 'Stelle ein, wie häufig und wie viele Wochen du Benachrichtigungen erhalten willst.'
									},
									{
										name: "/Benachrichtigungs_feed",
										value: "Erhalte deine ganzen Gebetsanliegen SOFORT. Ohne Lieferzeit und Versandkosten."
									}
								]
							}
						]
					});
					await introduction.pin("Anleitung")
				}
				const id = interaction.customId.substring(4);
				try {
					const swallowed = await prisma.swallowed.findFirstOrThrow({
						where: {
							id: id
						},
						include: {
							Embed: true
						}
					});
					let fetched_user = (
						await this.container.client.guilds.cache.get(swallowed.guildId)?.members.fetch({
							force: true
						})
					)?.get(swallowed.author_id);
					if (fetched_user == undefined) {
						await interaction.reply({
							ephemeral: true,
							embeds: [
								{
									description: 'Der Nutzer ist nicht mehr auf diesem Server aktiv.',
									title: 'Fehler',
									color: 0xff0000
								}
							]
						});
						return;
					}

					const embed = await prisma.embed.findFirst({
						where: {
							messageId: interaction.user.id,
							swallowedId: id
						}
					})
					if (embed) {
						await interaction.reply({
							ephemeral: true,
							embeds: [
								{
									title: 'Bereits abonniert',
									description: 'Hat deine Katze etwa deine Maus gefangen?',
									color: 0x12d900
								}
							]
						});
						return;
					}

					await prisma.message.update({
						where: {
							id: interaction.user.id
						},
						data: {
							embeds: {
								create: {
									Swallowed: {
										connect: {
											id: swallowed.id
										}
									}
								}
							}
						}
					});
					await interaction.reply({
						ephemeral: true,
						embeds: [
							{
								title: 'Abonniert',
								description: `Danke, dass du für ${fetched_user.nickname ?? fetched_user.displayName} betest!`,
								color: 0x12d900
							}
						]
					});
					return;
				} catch (e) {
					this.container.logger.error(e);
					return;
				}
			}
			if (interaction.customId.startsWith('delete_')) {
				const id = interaction.customId.substring(7);
				try {
					const swallowed = await prisma.swallowed.findFirstOrThrow({
						where: {
							id: id
						},
						include: {
							Embed: true
						}
					});
					if (interaction.user.id == swallowed.author_id) {
						const channel = await (
							await this.container.client.guilds.cache.get(swallowed.guildId)?.channels.fetch()
						)?.get(swallowed.channel_id);
						(await (channel as TextChannel).messages.fetch()).get(swallowed.new_id)?.delete();
						await prisma.swallowed.deleteMany({
							where: {
								id: id
							}
						});
					} else {
						const embed = await prisma.embed.findFirst({
							where: {
								messageId: interaction.user.id,
								swallowedId: id
							}
						})
						if (embed===null) {
							await interaction.reply({
								ephemeral: true,
								embeds: [
									{
										title: 'Bereits abonniert / Nutzer nicht registriert',
										description: 'Hat deine Katze etwa deine Maus gefangen?',
										color: 0x12d900
									}
								]
							});
							return;
						}
						await prisma.embed.deleteMany({
							where: {
									swallowedId: id,
									messageId: interaction.user.id
							}
						});
					}

					await interaction.reply({
						ephemeral: true,
						embeds: [
							{
								title: interaction.user.id == swallowed.author_id ? 'Gelöscht' : 'Deabonniert',
								color: 0x12d900
							}
						]
					});
				} catch (e) {
					this.container.logger.error(e);
				}
			}
			if (interaction.customId.startsWith('edit_')) {
				const id = interaction.customId.substring(5);
				try {
					const swallowed = await prisma.swallowed.findFirstOrThrow({
						where: {
							id: id
						}
					});
					this.container.logger.debug(id);
					if (interaction.user.id == swallowed.author_id) {
						this.container.logger.debug('Start Editing...');
						const modal = new ModalBuilder().setTitle('Nachricht bearbeiten').setCustomId(`modal_edit_${swallowed.id}`);
						const input = new TextInputBuilder()
							.setCustomId(`new_text`)
							.setLabel('Text bearbeiten')
							.setPlaceholder('Neuer Text')
							.setValue(swallowed.message_content)
							.setStyle(TextInputStyle.Paragraph)
							.setRequired(true);
						const actRow = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
						modal.addComponents(actRow);
						this.container.logger.debug(swallowed);
						this.container.logger.debug('Showing Modal...');
						await interaction.showModal(modal);
					} else {
						await interaction.reply({
							embeds: [
								{
									color: 0xff0000,
									title: 'Befehl verweigert',
									description: 'Du hast die Nachricht nicht geschrieben.'
								}
							],
							ephemeral: true
						});
						return;
					}
				} catch (e) {
					this.container.logger.error(e);
					return;
				}
			}
			if (interaction.customId.startsWith('check_')) {
				this.container.logger.debug('Checkmark set...');
				const id = interaction.customId.substring(6);
				try {
					const swallowed = await prisma.swallowed.findFirstOrThrow({
						where: {
							id: id
						}
					});
					const channel = await this.container.client.channels.fetch(swallowed.channel_id);
					if (channel == null) {
						this.container.logger.error('No Channel!');
						return;
					}
					const msg = await (channel as TextChannel).messages.fetch(swallowed.new_id);
					this.container.logger.debug(msg);
					if (interaction.user.id == swallowed.author_id) {
						await msg?.edit({
							components: []
						});
						await interaction.reply({
							embeds: [
								{
									color: 0x12d900,
									title: 'Fertig',
									description: `Schön, dass dieses Anliegen erledigt ist!\nWillst du kurz etwas dazu erzählen?`
								}
							],
							ephemeral: true
						});
						await prisma.swallowed.deleteMany({
							where: {
								id: id
							}
						});
					} else {
						await interaction.reply({
							embeds: [
								{
									color: 0xff0000,
									title: 'Befehl verweigert',
									description: 'Du hast die Nachricht nicht geschrieben.'
								}
							],
							ephemeral: true
						});
						return;
					}
				} catch (e) {
					this.container.logger.error(e);
					return;
				}
			}
		}
		if (interaction.isModalSubmit()) {
			if (interaction.customId.startsWith('modal_edit_')) {
				const new_text = interaction.fields.getTextInputValue('new_text');
				const id = interaction.customId.substring(11);
				this.container.logger.debug(id);
				this.container.logger.debug(new_text);
				await prisma.swallowed.updateMany({
					where: {
						id: id
					},
					data: {
						message_content: new_text
					}
				});
				try {
					const swallowed = await prisma.swallowed.findFirstOrThrow({
						where: {
							id: id
						}
					});
					this.container.logger.debug(swallowed);

					const channel = await this.container.client.channels.fetch(swallowed.channel_id);
					if (channel == null) return;
					const msg = await (channel as TextChannel).messages.fetch(swallowed.new_id);
					this.container.logger.debug(msg); // ist undefined. TODO
					if (msg === undefined) return;

					let first_embed = msg.embeds[0];
					let embeds: APIEmbed[] = [];
					embeds.push({
						title: first_embed.title ?? '',
						description: new_text,
						color: first_embed.color ?? undefined,
						thumbnail: first_embed.thumbnail ?? undefined,
						author: first_embed.author ?? undefined
					});
					if (msg.embeds.length > 1) {
						msg.embeds.slice(1).forEach((embed_) => {
							if (embed_.image?.url !== undefined) {
								embeds.push({
									color: embed_.color ?? 0xd86124,
									image: {
										url: embed_.image?.url,
										height: embed_.image?.height,
										width: embed_.image?.width
									}
								});
							}
						});
					}
					await msg?.edit({
						embeds: embeds
					});
					await prisma.swallowed.updateMany({
						where: {
							id: id
						},
						data: {
							message_content: new_text
						}
					});
					await interaction.reply({
						embeds: [
							{
								color: 0x12d900,
								title: 'Aktualisiert',
								description: `Neue Nachricht übernommen`
							}
						],
						ephemeral: true
					});
					return;
				} catch (e) {
					this.container.logger.error(e);
					return;
				}
			}
		}
	}
}
