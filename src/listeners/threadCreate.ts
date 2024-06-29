import {PrismaClient} from '@prisma/client';
import {ApplyOptions} from '@sapphire/decorators';
import {Listener} from '@sapphire/framework';
import type {ThreadChannel} from "discord.js";

const prisma = new PrismaClient();

@ApplyOptions<Listener.Options>({})
export class UserEvent extends Listener {
    public override async run(thread: ThreadChannel) {
        const starter_msg = await thread.fetchStarterMessage({force: true})
        if (starter_msg?.author.id === this.container.client.user?.id) {
            const swallowed = await prisma.swallowed.findFirst({
                where: {
                    new_id: starter_msg?.id
                }
            })
            if (swallowed === null) {
                return this.container.client.logger.debug("Thread created by me, but not swallowed. Strange...")
            }
            const original_user = await this.container.client.guilds.cache.get(swallowed.guildId)?.members.fetch(swallowed.author_id)
            if (original_user?.id === swallowed.author_id) {
                return
            }

            if (original_user === undefined) {
                await thread.send("**Hinweis:** *Der ursprüngliche Nutzer befindet sich wahrscheinlich nicht mehr auf dem Server. Ist dies nicht so, bitte erwähne ihn selbst mit @nutzer um ihn in diesen Thread einzuladen")
                return
            }
            await thread.send(`${original_user} Stups!`)
        }
    }
}
