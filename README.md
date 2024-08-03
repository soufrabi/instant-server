# Instant Server

Uses socket.io to push messages to client

## Development

Clone repo
```sh
git clone https://github.com/soufrabi/instant-server
cd instant-server
```

Run app
```sh
npm i
npm run build
npm run start
```

## Deploy using Docker

Docker image is hosted at <https://hub.docker.com/r/soufrabidev/instant-server/>

## Environment variables

- NODE_ENV
:  Set to `production` in production environment
- WEBSITE_URL_DOMAIN
: Set to `https://domain.tld` or `http://localhost:<PORT_NO>`

