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
					await prisma.message.create({
						data: {
							id: interaction.user.id
						}
					});
					const introduction = await interaction.user.send({
						content: `Hallo!
Ich, dein persönlicher Gebets-Erinnerungsbot, grüße dich hiermit herzlichst. Es ist mir eine Ehre, an deinem Gedächtnis anzuklopfen und dich an die Gebetsanliegen zu erinnern. Falls du ändern möchtest, wie häufig ich dich erinnere, kannst du dies durch die unten stehenden Befehle anpassen.`,
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
										name: '/Benachrichtigungs_feed',
										value: 'Erhalte deine ganzen Gebetsanliegen SOFORT. Ohne Lieferzeit und Versandkosten.'
									}
								]
							}
						]
					});
					await introduction.pin('Anleitung');
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
						await this.container.client.guilds.cache.get(swallowed.guildId)?.members.fetch(swallowed.author_id)
					) //?.get(swallowed.author_id);
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
					});
					if (embed) {
						await interaction.reply({
							ephemeral: true,
							embeds: [
								{
									title: 'Obsolet',
									description: 'Du hast das bereits abonniert.',
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

					// Hier weiterarbeiten: 
					const channel = await (
						await this.container.client.guilds.cache.get(swallowed.guildId)?.channels.fetch()
					)?.get(swallowed.channel_id);
					const new_msg = (await (channel as TextChannel).messages.fetch()).get(swallowed.new_id)
					const count = await prisma.embed.count({
						where: {
							swallowedId: id
						}
					})
					await new_msg?.edit(
						{	components: [{
							type: 1,
							components: [
								{
									style: 1,
									label: `Abonnieren (${count})`,
									custom_id: `abo_${swallowed.id}`,
									disabled: false,
									emoji: {
										id: undefined,
										name: `🔔`
									},
									type: 2
								},
								{
									style: 4,
									label: `Deabonnieren`,
									custom_id: `deabo_${swallowed.id}`,
									disabled: false,
									emoji: {
										id: undefined,
										name: `✖️`
									},
									type: 2
								},
								{
									style: 2,
									label: '',
									custom_id: `edit_${swallowed.id}`,
									disabled: false,
									emoji: {
										id: undefined,
										name: `📝`
									},
									type: 2
								},
								{
									style: 3,
									custom_id: `check_${swallowed.id}`,
									disabled: false,
									emoji: {
										id: undefined,
										name: `✔`
									},
									type: 2
								},
								{
									style: 4,
									custom_id: `delete_${swallowed.id}`,
									disabled: false,
									emoji: {
										id: undefined,
										name: '🗑️'
									},
									type: 2
								}
							
							]
						}]}
					)

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
					//console.log(e);
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
						await interaction.reply({
							ephemeral: true,
							embeds: [
								{
									title: 'Keine Rechte',
									description: 'Du hast das nicht gepostet!',
									color: 0xffffff
								}
							]
						});
						return;
					}
				} catch (e) {}
			}

			if (interaction.customId.startsWith('deabo_')) {
				const id = interaction.customId.substring(6);
				try {
				const swallowed = await prisma.swallowed.findFirstOrThrow({
					where: {
						id: id
					},
					include: {
						Embed: true
					}
				});

				const embed = await prisma.embed.findFirst({
					where: {
						messageId: interaction.user.id,
						swallowedId: id
					}
				});
				if (embed === null) {
					await interaction.reply({
						ephemeral: true,
						embeds: [
							{
								title: 'Noch nicht abonniert',
								description: 'Overflow_defender exited with ERROR CODE 0',
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

				const channel = await (
					await this.container.client.guilds.cache.get(swallowed.guildId)?.channels.fetch()
				)?.get(swallowed.channel_id);
				const new_msg = (await (channel as TextChannel).messages.fetch()).get(swallowed.new_id)
				const count = await prisma.embed.count({
					where: {
						swallowedId: id
					}
				})
				let count_text = "";
				if (count > 0) {
					count_text = " (" + count.toString() + ")"
				}

				await new_msg?.edit(
					{	components: [{
						type: 1,
						components: [
							{
								style: 1,
								label: `Abonnieren${count_text}`,
								custom_id: `abo_${swallowed.id}`,
								disabled: false,
								emoji: {
									id: undefined,
									name: `🔔`
								},
								type: 2
							},
							{
								style: 4,
								label: `Deabonnieren`,
								custom_id: `deabo_${swallowed.id}`,
								disabled: false,
								emoji: {
									id: undefined,
									name: `✖️`
								},
								type: 2
							},
							{
								style: 2,
								label: '',
								custom_id: `edit_${swallowed.id}`,
								disabled: false,
								emoji: {
									id: undefined,
									name: `📝`
								},
								type: 2
							},
							{
								style: 3,
								custom_id: `check_${swallowed.id}`,
								disabled: false,
								emoji: {
									id: undefined,
									name: `✔`
								},
								type: 2
							},
							{
								style: 4,
								custom_id: `delete_${swallowed.id}`,
								disabled: false,
								emoji: {
									id: undefined,
									name: '🗑️'
								},
								type: 2
							}
						
						]
					}]}
				)

				interaction.reply({
					ephemeral: true,
					embeds: [
						{
							title: 'Deabonniert',
							description: 'Du kannst die Nachricht natürlich wieder abonnieren.',
							color: 0x12d900
						}
					]
				});
				return;} catch (e) {

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
					return;
				}
			}
		}
	}
}
