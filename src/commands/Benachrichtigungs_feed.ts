import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { APIEmbed } from 'discord.js';
const prisma = new PrismaClient();
@ApplyOptions<Command.Options>({
	description: 'Erhalte deine abonnierten Gebetsanliegen sofort'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		try {
			const msg = await prisma.message.findFirstOrThrow({
				where: {
					id: interaction.user.id
				},
				include: {
					embeds: {
						include: {
							Swallowed: true
						}
					}
				}
			});
			if (msg.embeds.length == 0) {
				throw Error;
			}
			let embeds: APIEmbed[] = [];
			msg.embeds.forEach((embed) => {
				let color_temp = 0;
				if (embed.Swallowed.color === null) {
					color_temp = 0;
				} else {
					color_temp = embed.Swallowed.color;
				}
				embeds.push({
					title: `Gebetsanliegen von ${embed.Swallowed.author}`,
					url: embed.Swallowed.url,
					description: embed.Swallowed.message_content,
					color: color_temp,
					author: {
						name: embed.Swallowed.author,
						icon_url: embed.Swallowed.author_avatar_url ?? undefined
					}
				});
			});
			return interaction.reply({ content: 'Dein Feed', embeds: embeds, ephemeral: !interaction.channel?.isDMBased() });
		} catch {
			return interaction.reply({
				embeds: [
					{
						color: 0xff0000,
						title: 'Befehl verweigert',
						description: 'Du hast anscheinend nichts abonniert.'
					}
				],
				ephemeral: true
			});
		}
	}
}
