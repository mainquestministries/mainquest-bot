import '#lib/setup';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { Partials } from 'discord.js';
const prisma = new PrismaClient();
const client = new SapphireClient({
	defaultPrefix: '!',
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: [
		'Guilds',
		'GuildMembers',
		'GuildBans',
		'GuildEmojisAndStickers',
		'GuildVoiceStates',
		'GuildMessages',
		'GuildMessageReactions',
		'DirectMessages',
		'DirectMessageReactions'
	],
	partials: [Partials.Channel],
	loadMessageCommandListeners: true
});

const main = async () => {
	try {
		if (!(existsSync("serverconfig.json"))) {
			client.logger.fatal("Config file not found, exiting") 
			throw new Error()
		}
		client.logger.info('Logging in');
		//console.log("Token: "+process.env["DISCORD_TOKEN"])
		await client.login();
		await prisma.$connect();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		await prisma.$disconnect();
		process.exit(1);
	}
};

main();
