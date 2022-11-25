import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuInteraction, Message } from 'discord.js';

export class UserPrecondition extends Precondition {
	public override messageRun(message: Message) {
		if (message.guildId === null) {
			message.channel.send('Das kannst du hier nicht verwenden.');
			return this.ok();
		}
		return this.error();
	}

	public override chatInputRun(interaction: CommandInteraction) {
		if (interaction.guildId === null) {
			interaction.reply({
				embeds: [
					{
						color: 0xff0000,
						title: 'Befehl verweigert',
						description: 'Das kannst du nicht in einer DM nutzen.'
					}
				],
				ephemeral: true
			});
		}
		return this.ok();
	}

	public override contextMenuRun(interaction: ContextMenuInteraction) {
		if (interaction.guildId === null) {
			interaction.reply({
				embeds: [
					{
						color: 0xff0000,
						title: 'Befehl verweigert',
						description: 'Das kannst du nicht in einer DM nutzen.'
					}
				],
				ephemeral: true
			});
		}
		return this.ok();
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		guildchannel: never;
	}
}
