import { rootDir } from '#lib/constants';
import { date_string } from '#lib/date';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { readFileSync } from 'fs';
import { join } from 'path';
@ApplyOptions<Command.Options>({
	description: 'Gibt den heutigen Lehrtext aus.'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		})
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const data: Array<Array<string>> = JSON.parse(readFileSync(join(rootDir, 'losungen.json')).toString());
			const today = date_string(new Date());
			data.forEach((item) => {
				if (item[0] === today) {
					interaction.reply({
						embeds: [
								{
									title: `Lehrtext für den ${today}`,
									description: `*${item[5]}:* ${item[6]}`,
									color: 0x0055AA
								}
							]
					})
	}
})}}
