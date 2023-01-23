import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient();

@ApplyOptions<Command.Options>({
	description: 'Willkommens-channel aktualisieren',
	preconditions: ['admin', 'guildchannel'],
	cooldownDelay: 10_000
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption(
					(option) => 
					option.setName("Rollen-ID")
					.setRequired(false)
					.setDescription("Die ID, die zugewiesen werden soll, nachdem der User in dem Channel postet.")
				)
				.addStringOption( (option)=> 
				option.setDescription("Text, der dem Nutzer geschickt wird.").
				setName("Willkommenstext").setRequired(false))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
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
					w_channel: interaction.channelId,
					verified_role: interaction.options.data[0].value?.toString(),
					w_dm_text: interaction.options.data[1].value?.toString()
				}
			});
		} catch (e) {
			await prisma.guildconfig.create({
				data: {
					id: interaction.guildId as string,
					w_channel: interaction.channelId,
					verified_role: interaction.options.data[0].value?.toString(),
					w_dm_text: interaction.options.data[1].value?.toString()
				}
			});
		}
	}
}
