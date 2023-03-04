import path, { join } from 'path';

const _dirname_ = path.resolve(path.dirname(''));
export const rootDir = join(_dirname_);
export const srcDir = join(rootDir, 'src');
export const days_of_week: Record<number, number> = {
	1: 7,
	2: 3,
	3: 2,
	4: 1
};
export const days_of_week_from_modulo: Record<number, number> = {
	7: 1,
	3: 2,
	2: 3,
	1: 7
};
export const RandomLoadingMessage = ['Computing...', 'Thinking...', 'Cooking some food', 'Give me a moment', 'Loading...'];
