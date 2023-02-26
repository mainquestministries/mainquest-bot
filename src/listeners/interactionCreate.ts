import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Interaction, TextChannel } from 'discord.js';
const prisma = new PrismaClient();

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener {
	public async run(interaction: Interaction) {
		if (!interaction.isButton()) {
			return;
		}
		if (interaction.customId.startsWith("abo_")) {
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
			const id = interaction.customId.substring(4)
			try {
			const swallowed = await prisma.swallowed.findFirstOrThrow({
				where: {
					id : id
				}
			})
			let fetched_user = (await this.container.client.guilds.cache.get(swallowed.guild)?.members.fetch({
				force: true
			}))?.get(swallowed.author_id)
			if (fetched_user == undefined) {
				await interaction.reply({
					ephemeral: true,
					embeds: [{
						description: "Der Nutzer ist nicht mehr auf diesem Server aktiv.",
						title: "Fehler",
						color: 0xff0000
					}]
				})
				return	
			}
			let color_ = 0;
			if (fetched_user?.user.accentColor) {
				color_ = fetched_user?.user.accentColor;
			}
			if ((await prisma.message.count({
				where: {
					id: interaction.user.id, 
					embeds: {
						some: {
							original_message_id: swallowed.id as string
						}
					}
					

				}
			})) == 1) {
				await interaction.reply( {
					ephemeral: true,
					embeds: [{
						title: "Bereits abonniert",
						description: "Hat deine Katze etwa deine Maus gefangen?",
						color: 0x12d900
					}]
				})
				return
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
				embeds: [{
					title: "Abonniert",
					description: `Danke, dass du für ${fetched_user.nickname ?? fetched_user.displayName} betest!`,
					color: 0x12d900
				}]
			})
			return
		}
		catch (e) {
			this.container.logger.error(e)
			return
		}}
		if (interaction.customId.startsWith("delete_")) {
			const id = interaction.customId.substring(7)
			try {
				const swallowed = await prisma.swallowed.findFirstOrThrow({
					where: {
						id: id
					}
				})
				if (interaction.user.id == swallowed.author_id) {
					const channel = await (await this.container.client.guilds.cache.get(swallowed.guild)?.channels.fetch())?.get(swallowed.channel_id);
					(await (channel as TextChannel).messages.fetch()).get(id)?.delete()
					await prisma.swallowed.deleteMany({
						where: {
							id: id
						}
					})
					await prisma.embed.deleteMany({
						where: {
							original_message_id: id
						}
					})
				} else {
					if ((await prisma.message.count({
						where: {
							id: interaction.user.id, 
							embeds: {
								some: {
									original_message_id: swallowed.id as string
								}
							}
							
		
						}
					})) == 1) {
					prisma.embed.deleteMany({
						where: {
							original_message_id: id
						}
					})
				} else {
					await interaction.reply( {
						ephemeral: true,
						embeds: [{
							title: "Bereits abonniert",
							description: "Hat deine Katze etwa deine Maus gefangen?",
							color: 0x12d900
						}]
					})
					return
				}
			}
				await interaction.reply({
					ephemeral: true,
					embeds: [{
						title: interaction.user.id == swallowed.author_id ? "Gelöscht" : "Deabonniert",
						description: "Schade!",
						color: 0x12d900
					}]
				})
			} catch (e) {
				this.container.logger.error(e)
			}
		}
	}
}
