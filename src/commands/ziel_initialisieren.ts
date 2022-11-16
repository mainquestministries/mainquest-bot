import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient();

@ApplyOptions<Command.Options>({
	description: 'Registriert aktuellen Kanal als Ziel'
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
		if (interaction.guildId === null) {
			return interaction.reply('Es ist ein Fehler aufgetreten. Problemlösung: Funktionen nur dort nutzen, wo sie sinnvoll sind!');
		}
		try {
			await prisma.guildconfig.findFirstOrThrow({
				where: {
					id: interaction.guildId as string
				}
			});
			const member = await interaction.guild?.members.fetch(interaction.user.id)
			if(!(member?.permissions.has("ADMINISTRATOR")))
				return interaction.reply({
					content: "Du hast nicht die benötigten Rechte.",
					ephemeral: true
				})

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
		return interaction.reply({ content: 'Neue Konfiguration gespeichert.', ephemeral: true });
	}
}
