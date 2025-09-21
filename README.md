# Build & Deployment

## Docker

The web app is contained and can be built from  a Docker image, however, since image build and public deployment is being offloaded to [Koyeb](https://koyeb.com), we are building & storing the image with built-in ARGS and hosting in [Docker Hub](https://hub.docker.com/repository/docker/sergion14/uxcaptain/general)

## Local deployments

The web app can be run either via:

* Docker compose config from the server directory
* Standalone app via own npm commands

**Note:** In practice, none of `npm` commands should be used directly since the webapp should be spawned via the server's docker compose which includes the environmental variables

* `npm run docker-build:local` will build a local docker container - Should probably never be used since local development is spawned using docker compose via the server repository

* `npm run build` is used by the Dockerfile to build the app

* `npm run docker-build:prod` will build the Docker image for the `latest` branch and push it to Docker Hub

* `npm run docker-build:prod` will build the Docker image for the `next`branch and push it to Docker Hub

* `npm run start:local` would run the webapp as a standalone app but there is no .env file since we are using docker

### HMR (Hot module replacement) in development - # TODO

TODO -- Ideally there is hot module reload when running the webapp from docker compose

To use HMR, we are running the webapp service in Docker compose with vite build # FIX

## Production & Dev deployments

Deployments are triggered by pushing or merging to `next` and `latest` branches.

When new code is pushed to either branch, Koyeb which will:

* Build the Docker Image using the DockerFile
* Inject the build ARGS at build time
* Deploy the app & make it accessible

[Koyeb](https://koyeb.com) - easy to configure & serverless infrastructure running on AWS under the hood

### Making the app available publicly

The publicly available branches - `next` & `latest` - are served using [Nginx](https://nginx.org/) in Koyeb

### Build ARGS

Since the webapp is being built with Vite - all environmental variables must be set as ARGS during build time

ARGS for deployments are set up in the [Koyeb Project Configuration Environmental Variables configuration](https://app.koyeb.com/services/8a026356-e93c-4908-8757-7a2462d8f0e6/settings)

Direct access to services in Koyeb:

* [Prod](https://app.koyeb.com/services/bdabed51-1c35-41a7-a7db-464aa535826c?deploymentId=3dccda47-4481-4ab9-b20e-b0979e4ccddf)
* [Dev](https://app.koyeb.com/services/5f63a032-90e3-4aff-8b4a-b0a02ecf769b/settings)

An example list of env variables can be found in `.env.example` in the root directory
