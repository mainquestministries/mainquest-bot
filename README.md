# Mainquest-Bot

Bot für den [Mainquest-Server](https://mainquest.org) (remastered)

## Benutzung

### Vorbereitung

```sh
npm install
```

Zum automatischem konfigurieren `python3 ./init.py` ausführen.
Das Programm konfiguriert die Datenbank automatisch. Bitte halte die Verbindung
zu deiner Postgres-Datenbank bereit.

Fahre deine Datenbank hoch. Wenn du keine hast,
Nutze `./startdb`, um eine docker-Datenbank zu starten.
Auf anderen Betriebssystemen als auf Linux musst du database/docker-compose.yml
selber hochfahren.

Führe nun
`npx prisma migrate deploy`
aus, um das Datenbankschema auf deine Datenbank übertragen.

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
npm install
npx prisma generate
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
npx prisma migrate deploy
```

Container erstellen:

```sh
docker build -t mainquest:bot .
```

Ausführen:

```sh
docker run --network=host \
           --env DATABASE_URL="postgresql://YOUR_DATABASE_STRING" \
           --env DISCORD_TOKEN="YOUR_TOKEN_HERE" \
     mainquestbot:latest
```
