import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { MessageReaction, User } from 'discord.js';
const prisma = new PrismaClient();
@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener {
	public async run(reaction: MessageReaction, user: User) {
		if (user.bot) return;
		if (!(reaction.emoji.name === '🔔')) return;

		try {
			await prisma.guildconfig.findFirstOrThrow({
				where: {
					id: reaction.message.guildId as string,
					p_channel: reaction.message.channelId
				}
			});
		} catch (e) {
			return;
		}

		if (
			(await prisma.message.count({
				where: { id: user.id }
			})) === 0
		) {
			await prisma.message.create({
				data: {
					message_content: 'Dein Abo für heute',
					id: user.id
				}
			});
		}
		let fetched_user = await reaction.message.author?.fetch(true);
		let color_ = 0;
		if (fetched_user?.accentColor) {
			color_ = fetched_user?.accentColor;
		}
		this.container.logger.debug('Color: ' + color_);
		await prisma.message.update({
			where: {
				id: user.id
			},
			data: {
				embeds: {
					create: {
						original_message_id: reaction.message.id as string,
						content: reaction.message.content as string,
						author: reaction.message.member?.displayName as string,
						author_avatar_url: reaction.message.author?.displayAvatarURL() as string,
						title: `Gebetsanliegen von ${reaction.message.member?.displayName}`,
						color: color_
					}
				}
			}
		});
	}
}
