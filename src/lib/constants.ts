import path, { join } from 'path';

const __dirname = path.resolve(path.dirname(''))
export const rootDir = join(__dirname);
export const srcDir = join(rootDir, 'src');

export const RandomLoadingMessage = ['Computing...', 'Thinking...', 'Cooking some food', 'Give me a moment', 'Loading...'];
