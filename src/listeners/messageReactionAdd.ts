import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { MessageReaction, User } from 'discord.js';
const prisma = new PrismaClient()
@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener {
	public async run(reaction: MessageReaction, user: User) {
		let guild = null
		try {guild = (await prisma.guildconfig.findFirstOrThrow({
			where: {
				id: reaction.message.guildId as string,
				p_channel: reaction.message.channelId
			}
		}))} catch (e) {
			return
		}

		
	}
}
