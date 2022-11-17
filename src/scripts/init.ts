import type { PromptObject } from 'prompts';
import { execa } from 'execa';
import { writeFileSync } from 'fs';
import prompts from 'prompts';
import path, { join } from 'path';
import { Spinner } from '@favware/colorette-spinner';

const __dirname = path.resolve(path.dirname(''));
function write_file(filename: string, data: any) {
	/**
	 * flags:
	 *  - w = Open file for reading and writing. File is created if not exists
	 *  - a+ = Open file for reading and appending. The file is created if not exists
	 */
	writeFileSync(join(__dirname, filename), data, {
		flag: 'w'
	});
}

const Prompt: PromptObject<PromptTypes>[] = [
	
	{
		type: "text",
		name: 'database_string',
		message: 'Enter your Database string here.',
		initial: 'mysql://USERNAME:PASSWORD@hostname:port/DATABASE'
	},
	{
		type: 'text',
		name: 'discord_token',
		initial: '(Reuse)',
		message:
			'Enter your Token for discord. See https://www.writebots.com/discord-bot-token/ for help. The Bot must have also the scope "applications". Leave empty for reuse.'
	}
];

type PromptTypes =  'database_string' | 'discord_token';

async function main() {
	const response = await prompts<PromptTypes>(Prompt);

	const discord_token = `DISCORD_TOKEN=\"${response.discord_token}\"`;
	const database_string = `DATABASE_URL=\"${response.database_string}\"`;
	write_file(".env", database_string)

	if (response.discord_token !== '(Reuse)') write_file('./src/.env', discord_token);

	const npx_args = ['prisma', 'migrate', 'deploy']
	const spin = new Spinner();
	spin.start({ text: 'Writing to Database. Please wait. 🐈' });
	try {
		execa('npx', npx_args);
		execa('npx', ['prisma', 'generate']);
	} catch (e) {
		spin.error({
			text: 'Failed to write to the Database. 😿',
			mark: '❌'
		});
		console.error(e);
		process.exit(1);
	}
	spin.stop({
		text: 'Succeded 😻',
		mark: '✅'
	});
}
main();
