import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient();

@ApplyOptions<Command.Options>({
	description: 'Willkommens-channel aktualisieren',
	preconditions: ['admin', 'guildchannel'],
	cooldownDelay: 1_000
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addRoleOption((option) =>
					option
						.setName('rolle')
						.setRequired(false)
						.setDescription('Die Rolle, die zugewiesen werden soll, nachdem der User in dem Channel postet.')
				)
				.addStringOption((option) => option.setName('welcome_text').setDescription('Text, der dem Nutzer geschickt wird.').setRequired(false))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		//this.container.logger.debug(interaction.options.data[0])

		const v_role = interaction.options.getRole('rolle');
		const w_text = interaction.options.getString('welcome_text');

		if (v_role === null && w_text === null)
			return await interaction.reply({
				embeds: [
					{
						color: 0xff0000,
						title: 'Befehl verweigert',
						description: 'Du musst mindestens eine Option angeben.'
					}
				],
				ephemeral: true
			});
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
					verified_role: v_role?.id,
					w_dm_text: w_text
				}
			});
		} catch (e) {
			await prisma.guildconfig.create({
				data: {
					id: interaction.guildId as string,
					w_channel: interaction.channelId,
					verified_role: v_role?.id,
					w_dm_text: w_text
				}
			});
		}
		return await interaction.reply({
			embeds: [
				{
					color: 0x12d900,
					title: 'Neue Einstellung übernommen',
					description: 'Willkommens-channel eingerichtet.'
				}
			],
			ephemeral: true
		});
	}
}
