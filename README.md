# Mainquest-Bot

Bot für den [Mainquest-Server](https://mainquest.org) (remastered)

## Kommandos

### /ziel_initialisieren

Initialisiert den aktuellen Kanal als Gebets-channel. Nur für Admins verfügbar.

### /benachrichtigungen_aktivieren, /benachrichtigungen_deaktivieren

(De)aktiviert Benachrichtigungen.

### /benachrichtigungen_einstellen

Stellt die Benachrichtigungen ein.

## Installieren / Aufsetzen

Nur bei lokalen Systemen. Nicht nötig für Docker.

```sh
npm install
npm run configure
# Bei nicht-SQLite:
npm run migrate
```

Folge den Anweisungen des Programms.

## Ausführen

### Entwicklungsumgebungen

```sh
npm run dev
```

Mit `tsc-watch`

```sh
npm run watch:start
```

### Produktionsumgebungen

Erstellen:

```sh
npm run build
```

Und zum ausführen:

```sh
export NODE_ENV=production # Linux, MAC
set NODE_ENV=production
npm run start
```

### Produktionsumgebung mit Docker

Docker erfordert keine Vorbereitung.
Du benötigst dennoch deine Datenbank und die Verbindungsdetails.
Die Migration wird jedoch bei PostgreSQL und MySQL NICHT automatisch ausgeführt.

Migrieren (Dedizierte Datebank):

```sh
npm install
npm run configure # Du musst den Discord-Token nicht eingeben
npm run migrate
```

Container erstellen:

```sh
docker build -t mainquestbot:latest .
```

Alternativ kann der Container auch heruntergeladen werden:

```sh
docker pull ghcr.io/mainquestministries/mainquest-bot:master
docker tag ghcr.io/mainquestministries/mainquest-bot:master mainquestbot:latest
```

Volume für SQLite erstellen:

```sh
docker volume create mq_bot
```

Ausführen mit einer dedizierten Datenbank:

```sh
docker run --network=host \ 
           --env DATABASE_URL="dbschema://YOUR_DATABASE_STRING" \ 
           --env DISCORD_TOKEN="DEIN_DISCORD_TOKEN" \
     mainquestbot:latest
```

Ausführen mit SQLite:

```sh
docker run -v mq_bot:/data \
            --env DISCORD_TOKEN="DEIN_DISCORD_TOKEN" \
      mainquestbot:latest
```
