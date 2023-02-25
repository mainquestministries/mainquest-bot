import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { APIEmbedThumbnail, Attachment, Message } from 'discord.js';
const prisma = new PrismaClient();

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener {
	public async run(message: Message) {
		if (message.author.bot) return;
		try {
			await prisma.guildconfig.findFirstOrThrow({
				where: {
					p_channel: message.channelId,
					id: `${message.guildId}`
				}
			});

			this.container.logger.info('New valid Message...');
			this.container.logger.debug(message);
			//await message.react('🔔');

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
			let attachments: Attachment[] = [];
			if (message.attachments) {
				let attachments_ = message.attachments;
				attachments_.forEach((attach) => {
					attachments.push(attach);
				});
			}

			await message.channel.send({
				files: attachments,
				components: [
					{
						type: 1,
						components: [
							{
								style: 1,
								label: `Abonnieren`,
								custom_id: `row_0_button_0`,
								disabled: false,
								emoji: {
									id: undefined,
									name: `🔔`
								},
								type: 2
							},
							{
								style: 4,
								label: `Deabonnieren / löschen`,
								custom_id: `row_0_button_1`,
								disabled: false,
								emoji: {
									id: undefined,
									name: `🚫`
								},
								type: 2
							}
						]
					}
				],
				embeds: [
					{
						title: `Gebetsanliegen von ${message.member?.nickname ?? message.author.username}`,
						description: message.content,
						color: (await message.author.fetch(true)).accentColor ?? 0xd86124,
						thumbnail: thumbnail_,
						author: {
							name: message.member?.nickname ?? message.author.username,
							icon_url: avatar ?? undefined
						}
					}
				]
			});
			await message.delete();
		} catch (e) {
			this.container.logger.error(e);
		}
	}
}
