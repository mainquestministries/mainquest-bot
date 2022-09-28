import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@ApplyOptions<Command.Options>({
	description: 'A basic contextMenu command'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerContextMenuCommand((builder) =>
			builder //
				.setName(this.name)
				.setType(ApplicationCommandType.Message)
		);
	}

	public async contextMenuRun(interaction: Command.ContextMenuInteraction) {
		const current_guild = await prisma.guild.findMany({
			where: { id: interaction.guildId as string }
		});
		if (current_guild.length === 0) {
			await prisma.guild.create({
				data: {
					id: interaction.guildId as string,
					p_channel: interaction.channelId
				}
			});
			return await interaction.reply({
				content: `Registered guild: *${interaction.guild?.name}* with prayerchannel ${interaction.channel?.toString()} `
			});
		}

		await prisma.guild.update({
			where: { id: interaction.guildId as string },
			data: { p_channel: interaction.channelId }
		});
		return await interaction.reply({
			content: `Updated guild: *${interaction.guild?.name}* with prayerchannel ${interaction.channel?.toString()}`
		});
	}
}
