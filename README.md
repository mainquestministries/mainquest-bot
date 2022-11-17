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
SQLite ist NICHT unterstützt!

- Migrieren (Dedizierte Datebank):

```sh
npm install
npm run configure # Du musst den Discord-Token nicht eingeben
npm run migrate
```

Die Datenbank kann auch in einem CI/CD/CD-Prozess mittels `npx prisma migrate deploy` migriert werden.

- Container erstellen:
      - $DATENBANK_TYP kann entweder "postgres" oder "mysql" sein.

```sh
docker build -t mainquestbot:latest -e DB_TYPE=$DATENBANK_TYP .
```

- Ausführen mit einer dedizierten Datenbank:

```sh
docker run --network=host \ 
           --env DATABASE_URL="dbschema://DEIN_DATENBANK_STRING" \ 
           --env DISCORD_TOKEN="DEIN_DISCORD_TOKEN" \
     mainquestbot:latest
```
