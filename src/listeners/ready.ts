import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Store } from '@sapphire/framework';
import cron from 'node-cron';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import type { APIEmbed } from 'discord.js';
import { days_of_week } from '#lib/constants';
import { should_be_sended } from '#lib/utils';
const dev = process.env.NODE_ENV !== 'production';
const prisma = new PrismaClient();
@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue;
	public run() {
		this.printBanner();
		this.printStoreDebugInformation();
		const cron_str = dev ? '*/20 * * * * *' : '0 0 7 * * * *';
		cron.schedule(cron_str, async (now) => {
			//onst now = new Date()
			if (now === 'manual' || now === 'init' || process.env.SKIP_CRONJOB !== undefined) return;
			const msg_ = await prisma.message.findMany({
				include: {
					embeds: {
						include: {
							Swallowed: true
						}
					}
				}
			});
			let next_user = null;
			this.container.logger.info('*** Running from User to User...');
			msg_.forEach(async (msg) => {
				next_user = await this.container.client.users.fetch(msg.id, { force: true });
				if (msg.disabled === true) return;
				if (!should_be_sended(now.getDay(), msg.modulo)) {
					return;
				}
				await prisma.message.update({
					where: {
						id: msg.id
					},
					data: {
						embeds: {
							deleteMany: {
								sended: {
									gte: msg.repetitions
								}
							}
						}
					}
				});

				const embeds: APIEmbed[] = [];
				msg.embeds.forEach((embed) => {
					let color_temp = 0;
					if (embed.Swallowed.color === null) {
						color_temp = 0;
					} else {
						color_temp = embed.Swallowed.color;
					}
					let footer = null;
					if (embed.sended == 0) {
						const weeks_ = msg.repetitions / days_of_week[msg.modulo];
						const week_string = weeks_ == 1 ? 'nächste Woche' : `nächsten ${weeks_} Wochen`;
						footer =
							`Huh… Wie bin ich hier gelandet? Du hast wohl auf Abonnieren geklickt. Es ist mir eine Freude deinem Geistlichen Level zu verhelfen und deine Gehirnzellen an deine Jahresvorhaben zu erinnern. ` +
							`Gerne klopfe ich für dieses Gebetsanliegen bei dir an. Ich werde die ${week_string}, ${
								days_of_week[msg.modulo]
							}x pro Woche wieder bei dir auftauchen.`;
					}
					const temp_embed = {
						title: `Gebetsanliegen von ${embed.Swallowed.author}`,
						description: embed.Swallowed.message_content,
						color: color_temp,
						author: {
							name: embed.Swallowed.author,
							icon_url: embed.Swallowed.author_avatar_url ?? undefined
						},
						footer: footer === null ? undefined : { text: footer }
					};
					embeds.push(temp_embed);
				});
				if (embeds.length > 0) {
					this.container.logger.info(`Sending Message with ${embeds.length} Embeds to ${next_user.username}(${next_user.id})`);
					await prisma.message.update({
						where: {
							id: msg.id
						},
						data: {
							embeds: {
								updateMany: {
									where: {
										messageId: msg.id
									},
									data: {
										sended: {
											increment: 1
										}
									}
								}
							}
						}
					});
					await next_user.send({
						content: 'Klopf, Klopf\nIn deiner heutigen Gebetszeit, denk doch auch kurz an diese Anliegen.',
						embeds: embeds
					});
				}
			});
			this.container.logger.info('*** Coming home...');
		});
	}

	private printBanner() {
		const success = green('+');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}
