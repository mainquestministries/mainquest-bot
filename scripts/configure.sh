#! /bin/bash

function yes_or_no {
    while true; do
        read -p "$* [j/n]: " yn
        case $yn in
            [Jj]*) return 0  ;;
            [Nn]*) return 1 ;;
        esac
    done
}

echo "Leerlassen zum überspringen"
read -p "Discord-Token>" D_TOKEN 
echo "Leerlassen zum überspringen"
read -p "Datenbank-URL>" DB_URL

if [ -n $D_TOKEN ]; then
    echo "DISCORD_TOKEN=$D_TOKEN" > .env
else
    echo "Token unverändert"
fi

if [ -n $DB_URL ]; then
    echo "DATABASE_URL=$DB_URL" >> .env
else
    echo "Token unverändert"
fi


if ! command -v nvm &> /dev/null; then
        echo "NVM wurde nicht gefunden, Pakete können nicht installiert werden. Suche nach NPM..."
        npm ci --omit=dev || echo "NPM konnte entweder nicht gefunden hatte oder ist inkompatibel."
    else
        echo "NVM wurde aktiviert."
        echo "Ausgewählt: `nvm run node --version`"
        if yes_or_no "Ist das in Ordnung="; then
            nvm use node
        else
            "NVM wurde nicht akzeptiert, Pakete können nicht installiert werden."
            exit
        fi
    echo "Pakete werden installiert, bitte warten..."
    npm ci --omit=dev
fi

echo "Versuche, die Datenbank zu migrieren..."
npx prisma migrate deploy || echo "Die Datenbank konnte nicht migriert werden."
