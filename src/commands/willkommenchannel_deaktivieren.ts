import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@ApplyOptions<Command.Options>({
	description: "Willkommens-channel deaktivieren"
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
		await prisma.guildconfig.updateMany({
			where: {
				id: interaction.guildId as string
			},
			data: {
				p_channel: null
			}
		});

		await prisma.guildconfig.deleteMany({
			where: {
				l_channel: null,
				p_channel: null,
				w_channel: null
			}
		});
		return interaction.reply({
			embeds: [
				{
					color: 0x12d900,
					title: 'Konfiguration gespeichert',
					description: 'Willkommens-channel deaktiviert.'
				}
			],
			ephemeral: true
		});
	}
}
