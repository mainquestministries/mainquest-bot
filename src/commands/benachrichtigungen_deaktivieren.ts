import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient()

@ApplyOptions<Command.Options>({
	description: 'A basic slash command'
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
		if (await prisma.userconfig.count({
			where: {
				id: interaction.user.id
			}
		}) < 1) {
			await prisma.userconfig.create({
				data: {
					id: interaction.user.id
				}
			})
		}
		await prisma.userconfig.update({
			where: {
				id: interaction.user.id
			},
			data: {
				days: []
			}
		})
		return await interaction.reply({ 
			content: 'Du wirst nicht mehr benachrichtigt. Benutze /benachrichtigung_einstellen, um dich wieder benachrichtigen zu lassen.' });
	}
}
