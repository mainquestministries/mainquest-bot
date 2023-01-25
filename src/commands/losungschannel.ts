import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient();

@ApplyOptions<Command.Options>({
	preconditions: ['admin', 'guildchannel'],
	cooldownDelay: 1_000,
	description: 'Losungschannel hier platzieren.'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
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
					l_channel: interaction.channelId
				}
			});
		} catch (e) {
			await prisma.guildconfig.create({
				data: {
					id: interaction.guildId as string,
					l_channel: interaction.channelId
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
