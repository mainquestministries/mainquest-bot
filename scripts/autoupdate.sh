#! /bin/bash
echo "WICHTIG: Der Bot muss nach dem Update neugestartet werden, da es sonst zu unvorhersehbaren Ereignissen kommen kann."
echo "mainquestbot wird aktualisiert, bitte warten..."
echo -e "\n"
echo "Stoppe Bot..."
sudo supervisorctl stop mqbot

function yes_or_no {
    while true; do
        read -p "$* [j/n]: " yn
        case $yn in
            [Jj]*) return 0  ;;
            [Nn]*) return 1 ;;
        esac
    done
}


read TAG <<< $( curl -s https://api.github.com/repos/mainquestministries/mainquest-bot/releases  | jq ".[0].tag_name" | sed 's/\"//g' )

if test -f "./install_log.txt"; then
    source "./install_log.txt"
    echo "Aktuelle Version: $CURRENT_TAG"
    if [ "$TAG" = "$CURRENT_TAG" ]; then
        echo "Bereits die neueste Version."
        exit 0
    else
        if yes_or_no "Aktualisieren: $CURRENT_TAG->$TAG"; then
            echo "Aktualisierung wird durchgeführt."
        else
            echo "Abbruch durch Benutzer."
            exit 9
        fi
    fi
else
    echo "Die aktuelle Version konnte nicht überprüft werden."
    if yes_or_no "Durch $TAG ersetzen?"; then
        echo "Aktualisierung wird durchgeführt."
    else
        echo "Abbruch durch Benutzer."
        exit 9
    fi
fi

if  test -f "./.env" ; then
    echo "env-Datei existiert."
    cp ./.env $HOME/env_var.bak.txt

    echo "Backup fertig."
else
    echo "Datei nicht gefunden. Update wird feige verweigert."
    exit 127
fi

mkdir -p .cache

if wget -q --show-progress -O .cache/mqbot-latest.zip github.com/mainquestministries/mainquest-bot/releases/download/$TAG/mainquest-bot-release-$TAG.zip; then
    rm -r dist/
else
    echo "Download-Fehler"
    exit 1
fi

unzip -o .cache/mqbot-latest.zip -d .

rm -r .cache

if  test -f "./.env" ; then
    echo "./guildconfig.json und env-Datei existieren bereits. Backups werden zerstört."
    rm $HOME/env_var.bak.txt

else
    echo "Dateien nicht gefunden. Wiederherstellen..."
    mv $HOME/guildconfig.bak.json ./guildconfig.json
    mv $HOME/env_var.bak.txt ./.env
fi

echo "Update fertig!"
echo "Neue Version: $TAG"
echo "CURRENT_TAG=$TAG" > install_log.txt
echo "LAST_UPDATE=`date +%F`" >> install_log.txt

echo "Abhängigkeiten werden behoben..."


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
echo "Alle Abhängigkeiten aktualisiert"

echo "Versuche, die Datenbank zu migrieren..."
npx prisma migrate deploy
echo "Starte Bot neu..."
sudo supervisorctl restart mqbot
echo "Neustart erfolgt."

