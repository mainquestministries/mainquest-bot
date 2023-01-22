import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient();

@ApplyOptions<Command.Options>({
	description: 'Benachrichtigungen aktivieren'
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
		await prisma.message.updateMany({
			where: {
				id: interaction.user.id
			},
			data: {
				disabled: true
			}
		});
		this.container.logger.info('Messages deactivated for user: ' + interaction.user.id);
		return await interaction.reply({
			embeds: [
				{
					title: 'Du wirst nicht mehr benachrichtigt.',
					color: 0x12d900,
					description: 'Benutze /benachrichtigung_aktivieren, um dich wieder benachrichtigen zu lassen.'
				}
			],
			ephemeral: true
		});
	}
}
