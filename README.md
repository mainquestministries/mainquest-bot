# Mainquest-Bot

Bot für den [Mainquest-Server](https://mainquest.org) (remastered)

## Kommandos

### /ziel_initialisieren

Initialisiert den aktuellen Kanal als Gebetschannel. Nur für Admins verfügbar.

### /benachrichtigungen_aktivieren, /benachrichtigungen_deaktivieren

(De)aktiviert Benachrichtigungen.

### /benachrichtigungen_einstellen

Stellt die Benachrichtigungen ein.

## Installieren / Aufsetzen

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
Die Migration wird jedoch nicht automatisch ausgeführt.

Migrieren:

```sh
npm install
npm run configure
# Bei nicht SQLite:
npm run migrate
```

Container erstellen:

```sh
docker build -t mainquestbot:latest .
```

Alternativ kann der Container auch heruntergeladen werden:

```sh
docker tag ghcr.io/mainquestministries/mainquest-bot:master mainquestbot:latest
```

Volume für SQLite erstellen:

```sh
docker volume create mq_bot
```

Ausführen:

```sh
docker run --network=host \ # wenn nicht SQLite verwendet wird
           --env DATABASE_URL="dbschema://YOUR_DATABASE_STRING" \ # wenn nicht SQLite verwendet wird
           --env DISCORD_TOKEN="YOUR_TOKEN_HERE" \
           -v mq_bot:/opt/app/prisma/data # wenn sqlite verwendet wird
     mainquestbot:latest
```
