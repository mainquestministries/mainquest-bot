import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient();

@ApplyOptions<Command.Options>({
	preconditions: ['admin', 'guildchannel'],
	cooldownDelay: 1_000,
	description: 'Gebetschannel deaktivieren'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		await prisma.guild.delete({
			where: {
				id: interaction.guildId as string
			}
		});

		
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
