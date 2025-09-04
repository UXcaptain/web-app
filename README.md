# Build & Deployment

## Docker

The web app is contained in a Docker image

## Local deployments

The web app can be run either via:

* Docker compose config from the server directory
* Standalone app via own npm commands

**Note:** In practice, none of `npm` commands should be used directly since the webapp should be spawned via the server's docker compose which includes the environmental variables

* `npm run docker-build:local` will build a local docker container - Should probably never be used since we are running in compose

* `npm run build` is used by the Dockerfile to build the app

* `npm run docker-build:prod` will build the Docker image for the `latest` branch and push it to Docker Hub

* `npm run docker-build:prod` will build the Docker image for the `next`branch and push it to Docker Hub

* `npm run start:local` would run the webapp as a standalone app but there is no .env file since we are using docker

### HMR (Hot module replacement) in development

TODO -- Ideally there is hot module reload when running the webapp from docker compose

To use HMR, we are running the webapp service in Docker compose with vite build # FIX

## Production & Dev deployments

Deployments are triggered by pusing or merging to `next` and `latest` branches.
On new code, Koyeb which will trigger build & deploy using the Dockerfile

[Koyeb](https://koyeb.com) - easy to configure & serverless infrastructure running on AWS under the hood

### Making the app available online

The publicly available branches - `next` & `latest` - are served using [Nginx](https://nginx.org/) in Koyeb

### ARGS & Environmental variables

Enviromental variables for online deployments are set up in the [Koyeb Project Configuration](https://app.koyeb.com/services/8a026356-e93c-4908-8757-7a2462d8f0e6/settings)

Direct access to services in Koyeb:

* [Prod]() # COMPLETE
* [Dev](https://app.koyeb.com/services/5f63a032-90e3-4aff-8b4a-b0a02ecf769b/settings)

An list of env variables can be found in `.env.example` in the root directory
