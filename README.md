# Mainquest-Bot

[![CI/CD Pipeline](https://github.com/mainquestministries/mainquest-bot/actions/workflows/build_and_deploy.yml/badge.svg)](https://github.com/mainquestministries/mainquest-bot/actions/workflows/build_and_deploy.yml) [![CodeQL](https://github.com/mainquestministries/mainquest-bot/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/mainquestministries/mainquest-bot/actions/workflows/github-code-scanning/codeql)

Bot für den [Mainquest-Server](https://mainquest.org) (remastered)

## Kommandos

### /prayerchannel [NUR ADMIN]

Initialisiert den aktuellen Kanal als Gebets-channel.

### /prayerchannel_deaktivieren [NUR ADMIN]

Deaktiviert die prayerchannel-Funktion des Servers. HINWEIS: Löscht ALLE Benachrichtigungen des Gebetschannel.

### /benachrichtigungen_aktivieren, /benachrichtigungen_deaktivieren

(De)aktiviert Benachrichtigungen.

### /benachrichtigungen_einstellen

Stellt die Benachrichtigungen ein.

### Hinweis zu Losungen

Losungen wurden verschoben: [Losungsbot](https://github.com/mainquestministries/losungsbot)

### Hinweis zu Willkommenschannel

Ich habe keine Ahnung, was der Zweck davon war. WONTIMPLEMENT

## Installieren / Aufsetzen

Nur bei lokalen Systemen.

```sh
npm install
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
