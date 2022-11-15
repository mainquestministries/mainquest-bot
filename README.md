# Mainquest-Bot

Bot für den [Mainquest-Server](https://mainquest.org) (remastered)

## Benutzung

### Vorbereitung

```sh
npm install
npm run configure
```
Folge den Anweisungen des Programms.

### Entwicklungsumgebungen

Mit `tsc-watch` lokal ausführen

```sh
npm run watch:start
```

oder, ohne `tsc-watch`:

```sh
npm run dev
```

### Produktionsumgebungen

```sh
npm run build
```

Und zum ausführen:

```sh
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
```
Container erstellen:

```sh
docker build -t mainquestbot:latest .
```
Alternativ kann der Container auch heruntergeladen werden:

```sh
docker tag ghcr.io/mainquestministries/mainquest-bot:master mainquestbot:latest
```

Ausführen:

Die Datenbank-URL

```sh
docker run --network=host \ # wenn nicht SQLite verwendet wird
           --env DATABASE_URL="postgresql://YOUR_DATABASE_STRING" \ # wenn nicht SQLite verwendet wird
           --env DISCORD_TOKEN="YOUR_TOKEN_HERE" \
     mainquestbot:latest
```
