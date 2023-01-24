import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
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

			await message.react('🔔');
		} catch {}

		try {
			const g_config = await prisma.guildconfig.findFirstOrThrow({
				where: {
					w_channel: message.channelId
				}
			});
			if (!(g_config.w_dm_text === null || g_config.w_dm_text.length < 2)) {
				message.author.send(g_config.w_dm_text);
			}
			if (g_config.verified_role !== null) {
				const { client } = this.container;
				const server = await client.guilds.fetch(g_config.id);
				const role = await server.roles.fetch(g_config.verified_role, {
					force: true
				});
				if (role == null) {
					return this.container.logger.error(`Role with the ID ${g_config.verified_role} not found.`);
				} else {
					return await message.member?.roles.add(role);
				}
			}
		} catch {
			return;
		}
	}
}
