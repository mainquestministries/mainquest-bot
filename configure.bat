@echo off
npm install
npx tsc --target es2017 --module es2022 --moduleResolution node --allowSyntheticDefaultImports scripts/init.ts 
copy init.js .
node ./init.js
set ERROR %ERRORLEVEL%
del ./init.js
del ./scripts/init.js
exit %ERROR%