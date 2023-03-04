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

if [ -n $D_TOKEN ]; then
    echo "DISCORD_TOKEN=$D_TOKEN" > .env
else
    echo "Token unverändert"
fi

read -p "Guild-ID>" G_ID
read -p "Channel-ID>" C_ID

if [ -n "$G_ID" ] && [ -n "$C_ID"]; then
    echo {"guild_id":"$G_ID", "channel_id":"$C_ID"} > guildconfig.json
else 
    echo "IDs unverändet"
fi

if ! command -v npm &> /dev/null
then
    echo "npm wurde nicht gefunden."
    exit
else
    if ! command -v nvm &> /dev/null; then
        echo "NVM wurde nicht gefunden, Pakete können nicht installiert werden."
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