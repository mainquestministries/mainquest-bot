import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { days_of_week } from '#lib/constants';
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
								{ name: '3x pro Woche', value: 2 }, // 4 - 1, 3 - 2, 2- 3, 1 - 4
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
		let weeks = interaction.options.getInteger('wochen') ?? 2;

		const modulo_ = interaction.options.getInteger('wochentage', true);
		if (
			(await prisma.message.count({
				where: { id: interaction.user.id }
			})) === 0
		) {
			await prisma.message.create({
				data: {
					id: interaction.user.id,
					modulo: modulo_,
					repetitions: days_of_week[modulo_] * weeks
				}
			});
			const introduction = await interaction.user.send({
				content: `Hallo!
Ich, dein persönlicher Gebets-Erinnerungsbot, grüße dich hiermit herzlichst. Es ist mir eine Ehre, an deinem Gedächtnis anzuklopfen und dich an die Gebetsanliegen zu erinnern. Falls du ändern möchtest, wie häufig ich dich erinnere, kannst du dies durch die unten stehenden Befehle anpassen.`,
				embeds: [
					{
						title: 'Kurzanleitung',
						description: 'Du kannst jederzeit die Benachrichtigungen mithilfe von Slashcommands deaktivieren oder reduzieren.',
						fields: [
							{
								name: '/Benachrichtigungen_aktivieren',
								value: 'Aktiviert deine Benachrichtigungen (falls du diese deaktiviert hast)'
							},
							{
								name: '/Benachrichtigungen_deaktivieren',
								value: 'Deaktiviert deine Benachrichtigungen dauerhaft bis zum Einschalten.'
							},
							{
								name: '/Benachrichtigungen_einstellen',
								value: 'Stelle ein, wie häufig und wie viele Wochen du Benachrichtigungen erhalten willst.'
							},
							{
								name: '/Benachrichtigungs_feed',
								value: 'Erhalte deine ganzen Gebetsanliegen SOFORT. Ohne Lieferzeit und Versandkosten.'
							}
						]
					}
				]
			});
			await introduction.pin('Anleitung');
		} else {
			await prisma.message.update({
				where: {
					id: interaction.user.id
				},
				data: {
					modulo: modulo_,
					repetitions: days_of_week[modulo_] * weeks,
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
		}

		return await interaction.reply({
			embeds: [
				{
					color: 0x12d900,
					title: 'Neue Einstellung übernommen',
					description: `Du wirst nun erinnert: ${days_of_week[modulo_]}x pro Woche, ${weeks} Wochen lang.`
				}
			],
			ephemeral: true
		});
	}
}
