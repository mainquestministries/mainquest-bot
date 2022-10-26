# Mainquest-Bot

Bot für den [Mainquest-Server](https://mainquest.org) (remastered)

## Benutzung

### Vorbereitung

Normale Installation:

```sh
npm install
```

Produktion:

```sh
npm ci
```

Zum automatischem konfigurieren `python3 ./init.py` ausführen.
Das Programm konfiguriert die Datenbank automatisch. Bitte halte die Verbindung
zu deiner Postgres-Datenbank bereit.

Fahre deine Datenbank hoch. Wenn du keine hast,
Nutze `./startdb`, um eine docker-Datenbank zu starten.
Auf anderen Betriebssystemen als auf Linux musst du database/docker-compose.yml
selber hochfahren.

Führe nun
`npx prisma migrate dev`
aus, um das Datenbankschema auf deine Datenbank übertragen.

### Entwicklungsumgebungen

Im Watch-Modus lokal ausführen

```sh
npm run watch:start
```

oder

`npm run dev`

### Produktionsumgebungen

#### Mit docker:

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

#### Ohne docker:

```sh
npm install
npx prisma generate
npm run build
```

Und zum ausführen:

```sh
npm run start
```