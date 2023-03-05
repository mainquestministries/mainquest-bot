import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Store } from '@sapphire/framework';
import cron from 'node-cron';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { EmbedBuilder } from 'discord.js';
import { days_of_week } from '#lib/constants';
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
			//onst now = new Date()
			if (now === 'manual' || now === 'init' || process.env.SKIP_CRONJOB !== undefined) return;
			const msg = await prisma.message.findMany({
				include: {
					embeds: true,
				}
			});
			let next_user = null;
			this.container.logger.info('*** Running from User to User...');
			msg.forEach(async (msg) => {
				next_user = await this.container.client.users.fetch(msg.id, { force: true });
				let send_today = false;

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

				let embeds: EmbedBuilder[] = [];
				msg.embeds.forEach(async (embed_) => {
					const embed = await prisma.embed.findUniqueOrThrow({
						where: {
							id: embed_.id
						}, include: {
							Swallowed: true
						}
					});
					let color_temp = 0;
					if (embed.Swallowed.color === null) {
						color_temp = 0;
					} else {
						color_temp = embed.Swallowed.color;
					}
					let footer = null;
					if (embed.sended == 0) {
						const weeks_ = msg.repetitions / days_of_week[msg.modulo]
						const wochen_string = weeks_ == 1 ? "nächste Woche" : `nächsten ${weeks_} Wochen`
						footer = `Huh… Wie bin ich hier gelandet? Du hast wohl auf Abonnieren geklickt. Es ist mir eine Freude deinem Geistlichen Level zu verhelfen und deine Gehirnzellen an deine Jahresvorhaben zu erinnern. Gerne klopfe ich für dieses Gebetsanliegen bei dir an. Ich werde die ${wochen_string}, ${days_of_week[msg.modulo]}x pro Woche wieder bei dir auftauchen.`;
					}
					const temp_embed = new EmbedBuilder()
						.setTitle(`Gebetsanliegen von ${embed.Swallowed.author}`)
						.setDescription(embed.Swallowed.message_content)
						.setColor(color_temp)
						.setAuthor({
							name: embed.Swallowed.author,
							iconURL: embed.Swallowed.author_avatar_url ?? undefined
						})
						.setFooter(footer === null ? null : {text: footer});
					embeds.push(temp_embed);
				});
				this.container.logger.debug('Should be sended: ' + send_today);
				if (send_today && embeds.length > 0) {
					this.container.logger.info(`Sending Embeds: ${embeds.length}`);
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
						content: "Klopf, Klopf\nIn deiner heutigen Gebetszeit, denk doch auch kurz an diese Anliegen.",
						embeds: embeds
					});
				}
			});
			this.container.logger.info('*** Coming home...');
			/*
			this.container.logger.info('*** Biblebomber: ACTIVE');
			const data: Array<Array<string>> = JSON.parse(readFileSync(join(rootDir, `losungen_${now.getFullYear()}.json`)).toString());
			const today = date_string(now);
			const losungen = await prisma.guildconfig.findMany({
				where: {
					l_channel: {
						not: null
					}
				}
			});
			this.container.logger.debug('Lchannels: ' + losungen.length);
			data.forEach((item) => {
				//this.container.logger.debug(today)
				if (item[0] === today) {
					losungen.forEach(async (config) => {
						const channel = await (await this.container.client.guilds.fetch(config.id)).channels.fetch(config.l_channel as string);
						let new_msg = await (channel as TextChannel).send({
							embeds: [
								{
									title: `Tageslosung vom ${today}`,
									description: `*${item[3]}:* ${item[4]}`,
									color: 0x0055aa
								}
							]
						});
						await new_msg.startThread({
							name: `Tageslosung vom ${today}`
						});
						['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'].forEach(async (emoji_) => {
							await new_msg.react(emoji_);
						});
					});
				}
			});
			this.container.logger.info('*** Disabling Biblebomber mode');*/
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
