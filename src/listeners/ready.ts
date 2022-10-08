import { PrismaClient } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { MessageEmbed } from 'discord.js';
const prisma = new PrismaClient()
const dev = process.env.NODE_ENV !== 'production';

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue;

	public run() {
		this.printBanner();
		this.printStoreDebugInformation();
		setInterval(async () => {
			const msg = await prisma.message.findMany(
				{
					include: {
						embeds: true
					}
				}
			)
			let next_user = null
			msg.forEach(async (msg) => {
				next_user = await this.container.client.users.fetch(msg.id, {force: true})
				await prisma.embed.deleteMany({
					where: {
						messageId: msg.id,
						sended: msg.repetitions
					}
				})
				let embeds : MessageEmbed[] = [] 
				msg.embeds.forEach((embed) => 
				{embeds.push(new MessageEmbed(
					{
						title: embed.title,
						description: embed.content,
						author: {
							name: embed.author,
							 icon_url: embed.author_avatar_url,
							 proxyIconURL: embed.author_avatar_url
						},

					}
				))}) // TODO: Decrease embeds and delete them
				await next_user.send({
					content: msg.message_content,
					embeds: embeds
				})
				
		 }
		 )}
		  )	
			// Every Embed was sended
			prisma.embed.updateMany({
				data: {
					sended: {
						increment: 1
					}
				}
			})
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
