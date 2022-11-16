import type { PromptObject } from 'prompts';
import { execa } from 'execa';
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'fs';
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

function copy(src: string, dest: string) {
	copyFileSync(join(__dirname, src), join(__dirname, dest));
}
const Prompt: PromptObject<PromptTypes>[] = [
	{
		type: 'select',
		name: 'database_type',
		message: 'Which database do you want?',
		choices: [
			{
				title: 'SQLite)',
				value: 'sqlite'
			},
			{
				title: 'MySQL',
				value: 'mysql'
			},
			{
				title: 'PostgreSQL',
				value: 'postgres'
			}
		]
	},
	{
		type: (prev) => (prev != 'sqlite' ? 'text' : null),
		name: 'database_string',
		message: 'Enter your Database string here.',
		initial: 'dbschema://USERNAME:PASSWORD@hostname:port/DATABASE'
	},
	{
		type: 'text',
		name: 'discord_token',
		initial: '(Reuse)',
		message:
			'Enter your Token for discord. See https://www.writebots.com/discord-bot-token/ for help. The Bot must have also the scope "applications". Leave empty for reuse.'
	}
];

type PromptTypes = 'database_type' | 'database_string' | 'discord_token';

async function main() {
	const response = await prompts<PromptTypes>(Prompt);

	const discord_token = `DISCORD_TOKEN=\"${response.discord_token}\"`;
	const database_type = response.database_type;
	const database_string = `DATABASE_URL=\"${response.database_string}\"`;

	if (response.discord_token !== '(Reuse)') write_file('./src/.env', discord_token);

	const npx_args = ['prisma', 'migrate', 'deploy']
	if (database_type !== 'sqlite') {
		console.log("Please run manually: npm run migrate 😸")
		rmSync(join(__dirname, "./prisma"), {
			force: true, 
			recursive: true
		})
		mkdirSync(join(__dirname, "./prisma"))
		copy(join(__dirname, `./${database_type}.prisma`), './prisma/schema.prisma');
		
		write_file('./.env', database_string);
	}
	if(database_type==="sqlite"){
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
}}
main();
