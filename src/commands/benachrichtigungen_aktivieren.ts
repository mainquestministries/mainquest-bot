import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient();

@ApplyOptions<Command.Options>({
	description: 'Benachrichtigungen'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		await prisma.message.updateMany({
			where: {
				id: interaction.user.id
			},
			data: {
				disabled: false
								
			}
		})
		this.container.logger.info('Messages deactivated for user: ' + interaction.user.id);
		return await interaction.reply({
			content: 'Benachrichtigungen aktiviert.',
			ephemeral: true
		});
	}
}
