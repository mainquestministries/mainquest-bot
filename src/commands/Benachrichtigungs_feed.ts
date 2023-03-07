import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
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
				}, include: {
					embeds: true
				}
			})
			if (msg.embeds.length==0) {
				throw Error;
			}
			let embeds: EmbedBuilder[] = [];
				msg.embeds.forEach(async (embed_) => {
					const embed = await prisma.embed.findUniqueOrThrow({
						where: {
							id: embed_.id
						},
						include: {
							Swallowed: true
						}
					});
					let color_temp = 0;
					if (embed.Swallowed.color === null) {
						color_temp = 0;
					} else {
						color_temp = embed.Swallowed.color;
					}
					const temp_embed = new EmbedBuilder()
						.setTitle(`Gebetsanliegen von ${embed.Swallowed.author}`)
						.setDescription(embed.Swallowed.message_content)
						.setColor(color_temp)
						.setAuthor({
							name: embed.Swallowed.author,
							iconURL: embed.Swallowed.author_avatar_url ?? undefined
						})
						
					embeds.push(temp_embed);
				});
			return interaction.reply({ content: 'Dein Feed', embeds: embeds, ephemeral: true })
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
			})
		}
		;
	}
}
