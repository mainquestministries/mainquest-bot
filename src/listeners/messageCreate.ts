import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, type ListenerOptions } from '@sapphire/framework';
import { type APIEmbed, type APIEmbedThumbnail, Attachment, Message, MessageType } from 'discord.js';
const prisma = new PrismaClient();

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener {
	public async run(message: Message) {
		if (message.author.bot) return;
		if (message.channel.isThread()) return;
		if (message.channel.isDMBased()) return;
		if (message.guildId === null) return;
		if (message.mentions.everyone === true) return;
		if (message.type === MessageType.Reply) return;
		try {
			const guild_ = await prisma.guild.findFirst({
				where: {
					p_channel: message.channelId,
					id: `${message.guildId}`
				}
			});
			if (guild_ === null) return;

			this.container.logger.info('New valid Message...');

			let thumbnail_: APIEmbedThumbnail | undefined = undefined;
			let avatar: string | null = null;
			if ((await message.author.fetch(true)).avatar) {
				avatar = (await message.author.fetch(true)).avatarURL({
					extension: 'webp',
					size: 128
				});
				thumbnail_ = {
					url: avatar ?? '',
					height: 40,
					width: 40
				};
			}
			let embeds: APIEmbed[] = [];
			embeds.push({
				title: `Gebetsanliegen von ${message.member?.nickname ?? message.author.username}`,
				description: message.content,
				color: (await message.author.fetch(true)).accentColor ?? 0xd86124,
				thumbnail: thumbnail_,
				author: {
					name: message.member?.nickname ?? message.author.username,
					icon_url: avatar ?? undefined
				}
			});
			let attachments: Attachment[] = [];
			let temp_color = (await message.author.fetch(true)).accentColor ?? 0xd86124;
			if (message.attachments) {
				let attachments_ = message.attachments;
				attachments_.forEach((attach) => {
					if (attach.height !== null && attach.width !== null) {
						embeds.push({
							color: temp_color,
							image: {
								url: attach.url,
								height: attach.height,
								width: attach.width
							}
						});
					}
				});
			}
			if (message.channel.isVoiceBased()) return;
			const new_msg = await message.channel.send({
				files: attachments,
				components: [
					{
						type: 1,
						components: [
							{
								style: 1,
								label: `Abonnieren`,
								custom_id: `abo_${message.id}`,
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
								custom_id: `deabo_${message.id}`,
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
								custom_id: `edit_${message.id}`,
								disabled: false,
								emoji: {
									id: undefined,
									name: `📝`
								},
								type: 2
							},
							{
								style: 3,
								custom_id: `check_${message.id}`,
								disabled: false,
								emoji: {
									id: undefined,
									name: `✔`
								},
								type: 2
							},
							{
								style: 4,
								custom_id: `delete_${message.id}`,
								disabled: false,
								emoji: {
									id: undefined,
									name: '🗑️'
								},
								type: 2
							}
						]
					}
				],
				embeds: embeds
			});
			const color_ = (await message.author.fetch(true)).accentColor ?? undefined;
			await prisma.swallowed.create({
				data: {
					author_id: message.author.id,
					Guild: {
						connect: {
							id: message.guildId
						}
					},
					id: message.id,
					new_id: new_msg.id,
					channel_id: message.channelId,
					message_content: message.content,
					author: message.member?.nickname ?? message.author.username,
					author_avatar_url: avatar,
					color: color_,
					url: new_msg.url
				}
			});
			await message.delete();
		} catch (e) {
			this.container.logger.error(e);
		}
	}
}
