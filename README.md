# Mainquest-Bot

Bot für den [Mainquest-Server](https://mainquest.org) (remastered)
## Kommandos

### /ziel_initialisieren
Initialisiert den aktuellen Kanal. Dieser wird nun beobachtet. Nur für admins verfügbar.
### /benachrichtigungen_aktivieren, /benachrichtigungen_deaktivieren
(De)aktiviert Benachrichtigungen.
### /benachrichtigungen_einstellen
Stellt die Benachrichtigungen ein.

## Installieren / Aufsetzen

```sh
npm install
npm run configure
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


```sh
docker run --network=host \ # wenn nicht SQLite verwendet wird
           --env DATABASE_URL="dbschema://YOUR_DATABASE_STRING" \ # wenn nicht SQLite verwendet wird
           --env DISCORD_TOKEN="YOUR_TOKEN_HERE" \
     mainquestbot:latest
```
