npm install
npx tsc --target es2017 --module es2022 --moduleResolution node --allowSyntheticDefaultImports scripts/init.ts 
copy init.js .
node ./init.js
exit %ERRORLEVEL%