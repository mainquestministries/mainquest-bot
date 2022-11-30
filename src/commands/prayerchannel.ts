import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient();

@ApplyOptions<Command.Options>({
	description: 'Registriert aktuellen Kanal als Ziel'
})
export class UserCommand extends Command {
	public constructor(context: Command.Context) {
		super(context, {
			preconditions: ['admin', 'guildchannel'],
			cooldownDelay: 10_000
		});
	}
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		try {
			await prisma.guildconfig.findFirstOrThrow({
				where: {
					id: interaction.guildId as string
				}
			});

			await prisma.guildconfig.update({
				where: {
					id: interaction.guildId as string
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
		return interaction.reply({
			embeds: [
				{
					color: 0x12d900,
					title: 'Konfiguration gespeichert',
					description: 'Gebetschannel aktualisiert.'
				}
			],
			ephemeral: true
		});
	}
}
