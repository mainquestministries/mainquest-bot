import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@ApplyOptions<Command.Options>({
	description: 'A basic contextMenu command'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerContextMenuCommand((builder) =>
			builder //
				.setName(this.name)
				.setType(ApplicationCommandType.Message)
		);
	}

	public async contextMenuRun(interaction: Command.ContextMenuInteraction) {
		if (interaction.guildId === null) {
			return interaction.reply('Es ist ein Fehler aufgetreten. Problemlösung: Funktionen nur dort nutzen, wo sie sinnvoll sind!');
		}
		try {
			await prisma.guildconfig.findFirstOrThrow({
				where: {
					id: interaction.guildId as string
				}
			});

			await prisma.guildconfig.update({
				where: {
					id: interaction.guildId
				},
				data: {
					p_channel: interaction.channelId
				}
			});
		} catch (e) {
			await prisma.guildconfig.create({
				data: {
					id: interaction.guildId as string,
					p_channel: interaction.channelId
				}
			});
		}
		return interaction.reply('Neue Konfiguration gespeichert.');
	}
}
