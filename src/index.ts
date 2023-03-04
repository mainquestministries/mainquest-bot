import '#lib/setup';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { PrismaClient } from '@prisma/client';
import { Partials } from 'discord.js';
const prisma = new PrismaClient();
const client = new SapphireClient({
	defaultPrefix: '!',
	api: {
		automaticallyConnect: false,
		listenOptions: {
			port: 4001
		}
	},
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
		'MessageContent',
		'GuildMessageReactions',
		'DirectMessages',
		'DirectMessageReactions'
	],
	partials: [Partials.Channel],
	loadMessageCommandListeners: true
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		//console.log("Token: "+process.env["DISCORD_TOKEN"])
		if (process.env['SKIP_CRONJOB']) client.logger.info('Skipping Cronjobs permanently');
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
