if env | grep -q DATABASE_URL=
then
    echo Using dedicated Database...
    echo Migrations are not automatically applied!
else 
    npx prisma migrate deploy
fi
npm run start