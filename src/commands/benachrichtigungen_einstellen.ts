import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
	description: 'A basic slash command'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName("Konfiguration").setDescription("Konfiguration auwählen."
				+ " Siehe github.com/mainquestministries/mainquest_bot/...") //TODO
				.setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		return await interaction.reply({ content: 'Hello world!', ephemeral: true });
	}
}
