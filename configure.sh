#! /bin/sh
npm install
npx tsc --target es2017 --module es2022 --moduleResolution node --allowSyntheticDefaultImports scripts/init.ts 
cp scripts/init.js .
node ./init.js
export exit_=$?
rm ./init.js
exit $exit_