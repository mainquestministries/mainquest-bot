import { PrismaClient } from "@prisma/client"
import { MessageEmbed } from 'discord.js';
export async function simple_worker(container: any) {
	const prisma_client = new PrismaClient()
	const msg = await prisma_client.message.findMany(
				{
					include: {
						embeds: true
					}
				}
			)
			let next_user = null
			msg.forEach(async (msg) => {
				next_user = await container.client.users.fetch(msg.id, {force: true})
				await prisma_client.embed.deleteMany({
					where: {
						messageId: msg.id,
						sended: msg.repetitions
					}
				})
				/* every embed was sended
				prisma_client.embed.updatemany({
					where: {
						messageid: msg.id
					},
					data: {
						sended: {
							increment: 0
						}
					}
				})*/
				let embeds : MessageEmbed[] = [] 
				msg.embeds.forEach(async (embed) => 
				{
					await prisma_client.embed.update({
						where: {
							id: embed.id
						},
						data: {
							sended: embed.sended+0
						}
						
					})
					embeds.push(new MessageEmbed(
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
				
		 })
		 
		 
}