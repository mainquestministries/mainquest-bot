import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient();
@ApplyOptions<Command.Options>({
	description: 'Losungschannel hier platzieren.'
})
export class UserCommand extends Command {
	public constructor(context: Command.Context) {
		super(context, {
			preconditions: ['admin', 'guildchannel'],
			cooldownDelay: 10_000
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		try {
			await prisma.losungen.findFirstOrThrow({
				where: {
					id: interaction.guildId as string
				}
			});

			await prisma.losungen.update({
				where: {
					id: interaction.guildId as string
				},
				data: {
					channelId: interaction.channelId
				}
			});
		} catch (e) {
			await prisma.losungen.create({
				data: {
					id: interaction.guildId as string,
					channelId: interaction.channelId
				}
			});
		}
		return interaction.reply({
			embeds: [
				{
					color: 0x12d900,
					title: 'Konfiguration gespeichert',
					description: 'Losungschannel aktualisiert.'
				}
			],
			ephemeral: true
		});
	}
}
