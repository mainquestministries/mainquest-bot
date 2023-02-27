import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ActionRowBuilder, Interaction, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from 'discord.js';
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
				}
				const id = interaction.customId.substring(4);
				try {
					const swallowed = await prisma.swallowed.findFirstOrThrow({
						where: {
							id: id
						}
					});
					let fetched_user = (
						await this.container.client.guilds.cache.get(swallowed.guild)?.members.fetch({
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
					let color_ = 0;
					if (fetched_user?.user.accentColor) {
						color_ = fetched_user?.user.accentColor;
					}
					if (
						(await prisma.message.count({
							where: {
								id: interaction.user.id,
								embeds: {
									some: {
										original_message_id: swallowed.id as string
									}
								}
							}
						})) == 1
					) {
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
							id: fetched_user.id
						},
						data: {
							embeds: {
								create: {
									original_message_id: swallowed.id as string,
									content: swallowed.message_content as string,
									author: fetched_user.nickname ?? fetched_user.displayName,
									author_avatar_url: fetched_user.displayAvatarURL() as string,
									title: `Gebetsanliegen von ${fetched_user.nickname ?? fetched_user.displayName}`,
									color: color_,
									source: swallowed.guild
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
						}
					});
					if (interaction.user.id == swallowed.author_id) {
						const channel = await (
							await this.container.client.guilds.cache.get(swallowed.guild)?.channels.fetch()
						)?.get(swallowed.channel_id);
						(await (channel as TextChannel).messages.fetch()).get(swallowed.new_id)?.delete();
						await prisma.swallowed.deleteMany({
							where: {
								id: id
							}
						});
						await prisma.embed.deleteMany({
							where: {
								original_message_id: id
							}
						});
					} else {
						if (
							(await prisma.message.count({
								where: {
									id: interaction.user.id,
									embeds: {
										some: {
											original_message_id: swallowed.id as string
										}
									}
								}
							})) == 1
						) {
							prisma.embed.deleteMany({
								where: {
									original_message_id: id
								}
							});
						} else {
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
					}
					await interaction.reply({
						ephemeral: true,
						embeds: [
							{
								title: interaction.user.id == swallowed.author_id ? 'Gelöscht' : 'Deabonniert',
								description: 'Schade!',
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
				}}
				if (interaction.customId.startsWith('check_')) {
					this.container.logger.debug("Checkmark set...")
					const id = interaction.customId.substring(6);
					try {
						const swallowed = await prisma.swallowed.findFirstOrThrow({
							where: {
								id: id
							}
						});
						const channel = await this.container.client.channels.fetch(swallowed.channel_id);
						if (channel == null ) {this.container.logger.error("No Channel!"); return}
						const msg = await (channel as TextChannel).messages.fetch(swallowed.new_id);
						this.container.logger.debug(msg)
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
							await prisma.embed.deleteMany({
								where: {
									original_message_id: id
								}
							});
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
				await prisma.embed.updateMany({
					where: {
						original_message_id: id
					},
					data: {
						content: new_text
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
					if (channel == null ) return
					const msg = await (channel as TextChannel).messages.fetch(swallowed.new_id);
					this.container.logger.debug(msg); // ist undefined. TODO
					if (msg === undefined) return;
					
					let embed = msg.embeds[0];

					await msg?.edit({
						embeds: [
							{
								title: embed.title ?? '',
								description: new_text,
								color: embed.color ?? undefined,
								thumbnail: embed.thumbnail ?? undefined,
								author: embed.author ?? undefined
							}
						]
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
