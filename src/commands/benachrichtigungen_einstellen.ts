import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const prisma = new PrismaClient();
@ApplyOptions<Command.Options>({
	description: 'Benachrichtigungen einstellen'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption(
					(option) =>
						option
							.setName('wochentage')
							.setDescription('An wie vielen Tagen pro Woche willst du erinnert werden?')
							.setRequired(true)
							.setChoices(
								{ name: 'Jeder Tag', value: 1 },
								{ name: '3x pro Woche', value: 2 }, // 7 - 1, 3 - 2, 2- 3, 1 - 4
								{ name: '2x pro Woche', value: 3 },
								{ name: '1x pro Woche', value: 4 }
							) // range: 1-7
				)
				.addIntegerOption((option) =>
					option.setName('wochen').setDescription('Wie viele Wochen willst du erinnert werden?').setMaxValue(4).setMinValue(1)
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		let weeks = interaction.options.getInteger("wochen") ?? 1

		const modulo_ = interaction.options.getInteger("wochentage", true);
		await prisma.message.update({
			where: {
				id: interaction.user.id
			},
			data: {
				modulo: modulo_,
				repetitions: 7 * weeks,
				embeds: {
					updateMany: {
						where: {
							messageId: interaction.user.id
						},
						data: {
							sended: 0
						}
					}
				}
			}
		});
		const days_of_week: Record<number, string> = {
			1: '7x',
			2: '3x',
			3: '2x',
			4: '1x'
		};
		return await interaction.reply({
			embeds: [
				{
					color: 0x12d900,
					title: 'Neue Einstellung übernommen',
					description: `Du wirst nun erinnert: ${days_of_week[modulo_]} pro Woche, ${weeks} lang.`
				}
			],
			ephemeral: true
		});
	}
}
