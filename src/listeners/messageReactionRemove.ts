import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { MessageReaction, User } from 'discord.js';
const prisma = new PrismaClient();

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener {
	public async run(reaction: MessageReaction, user: User) {
		await prisma.embed.deleteMany({
			where: {
				messageId: user.id,
				original_message_id: reaction.message.id
			}
		});
	}
}
