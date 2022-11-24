import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuInteraction, Message } from 'discord.js';

export class UserPrecondition extends Precondition {
	public override async messageRun(message: Message) {
		if ( (await message.member?.fetch())?.permissions.has("ADMINISTRATOR")){
			message.channel.send(`${message.author}, du hast nicht genug Rechte für diese Aktion.`)
			return this.error({message: "Du hast nicht genug Rechte für diese Aktion."})}
		return this.ok();
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		if ( (await interaction.memberPermissions?.has("ADMINISTRATOR")))
			{interaction.reply({ embeds: [
				{
					color: 0xff0000,
					title: "Befehl verweigert",
					description: "Du hast nicht genug Rechte für diese Aktion."
				}
			]
				
			})
			return this.error({ message: `Command Abuse by ${interaction.user.id}`})}
		return this.ok();
	}

	public override async contextMenuRun(interaction: ContextMenuInteraction) {
		if ( (await interaction.memberPermissions?.has("ADMINISTRATOR")))
			{interaction.reply({ embeds: [
				{
					color: 0xff0000,
					title: "Befehl verweigert",
					description: "Du hast nicht genug Rechte für diese Aktion."
				}
			]
				
			})
			return this.error({ message: `Command Abuse by ${interaction.user.id}`})}
		return this.ok();
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		admin: never;
	}
}
