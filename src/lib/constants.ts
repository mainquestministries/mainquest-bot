import path, { join } from 'path';

const _dirname_ = path.resolve(path.dirname(''));
export const rootDir = join(_dirname_);
export const srcDir = join(rootDir, 'src');

export const RandomLoadingMessage = ['Computing...', 'Thinking...', 'Cooking some food', 'Give me a moment', 'Loading...'];
