import { Command, Precondition } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

export class UserPrecondition extends Precondition {
	public override messageRun(message: Message) {
		if (message.guildId === null) {
			if (message.channel.isVoiceBased()) return this.error({ message: "GAU: Jemand hat etwas in nem VoiceChannel geschrieben."})
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

	public override contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
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
