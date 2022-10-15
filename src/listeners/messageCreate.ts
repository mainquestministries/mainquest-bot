import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
const prisma = new PrismaClient()

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener {
	public async run(message : Message) {
		if (message.author.bot) return
		try {
		await prisma.guildconfig.findFirstOrThrow({
			where: {
				p_channel: message.channelId,
				id: `${message.guildId}`
			}
		})}	catch {
			return
		}
		await message.react("🔔")	
		
	}
}
