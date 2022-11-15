import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Store } from '@sapphire/framework';
import cron from 'node-cron';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { MessageEmbed } from 'discord.js';
const dev = process.env.NODE_ENV !== 'production';
const prisma = new PrismaClient();
@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue;

	public run() {
		this.printBanner();
		this.printStoreDebugInformation();
		const cron_str = dev ? '*/20 * * * * *' : '0 0 8 * * * *';

		cron.schedule(cron_str, async (now) => {
			const msg = await prisma.message.findMany({
				include: {
					embeds: true
				}
			});
			let next_user = null;
			this.container.logger.info('*** Starting Routine');
			msg.forEach(async (msg) => {
				next_user = await this.container.client.users.fetch(msg.id, { force: true });
				let send_today = false;

				//if (typeof now !== Date) return;
				if (msg.disabled === false && (now.getDay() + 1) % msg.modulo === 0) {
					send_today = true;
				}
				await prisma.message.update({
					where: {
						id: msg.id
					},
					data: {
						embeds: {
							deleteMany: {
								sended: msg.repetitions
							}
						}
					}
				});
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
				let embeds: MessageEmbed[] = [];
				msg.embeds.forEach(async (embed) => {
					let color_temp = 0;
					if (embed.color === null) {
						color_temp = 0;
					} else {
						color_temp = embed.color;
					}
					embeds.push(
						new MessageEmbed({
							title: embed.title,
							description: embed.content,
							color: color_temp,
							author: {
								name: embed.author,
								icon_url: embed.author_avatar_url,
								proxyIconURL: embed.author_avatar_url
							}
						})
					);
				});
				this.container.logger.debug('Should be sended: ' + send_today);
				if (send_today && embeds.length > 0) {
					this.container.logger.info(`Sending Embeds: ${embeds.length}`);
					await next_user.send({
						content: msg.message_content,
						embeds: embeds
					});
				}
			});
			this.container.logger.info('*** Ended Routine');
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
