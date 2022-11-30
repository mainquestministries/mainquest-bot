import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient()
@ApplyOptions<Command.Options>({
	description: 'Gebetschannel deaktivieren'
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
		})
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		await prisma.guildconfig.deleteMany( {
			where: {
				id: interaction.guildId as string
			}
		})
		await prisma.embed.deleteMany({
			where: {
				source: interaction.guildId as string
			}
		})
		return interaction.reply({
			embeds: [
				{
					color: 0x12d900,
					title: 'Konfiguration gespeichert',
					description: 'Gebetschannel deaktiviert.'
				}
			],
			ephemeral: true
		});
	}
}
