# FFC Tech Spike Autentication

> Test integration with Defra Id. 

## Prerequisites

- Docker
- Docker Compose

Optional:

- Kubernetes
- Helm

### Environment variables

The following environment variables are required by the application.
Values for development are set in the Docker Compose configuration. Default
values for production-like deployments are set in the Helm chart and may be
overridden by build and release pipelines.

| Name                                            | Description                                                                                      |
| ----                                            | -----------                                                                                      |
|DEFRAID_CLIENT_ID|The application ID assigned to your app during the registration with DEFRA Customer Identity.
|DEFRAID_CLIENT_SECRET| Secret supplied by DEFRA Customer Identity
|DEFRAID_KNOWN_AUTHORITIES| The know authority supplied by DEFRA Customer Identity
|DEFRAID_VALIDATE_AUTHORITY| The name of the issuing autority supplied by DEFRA Customer Identity
|DEFRAID_TENANT_NAME| The name of the Azure tenent for DEFRA Customer Identity
|DEFRAID_SERVICE_ID|The unique identifier for your service provided as part of being on-boarded to DEFRA Customer Identity.
|DEFRAID_REDIRECT_URL|The redirect_uri parameter of the application, where authentication responses can be sent and received by the application. This needs to be supplied to DEFRA Customer Identity.
|DEFRAID_SCOPE| openid `{client_id}` offline-access
|DEFRAID_SIGNOUT_REDIRECT_URL| A URL to redirect the user after a successful sign-out. This needs to be supplied to DEFRA Customer Identity.
|DEFRAID_SIGNOUT_URL| The end_session_endpoint found within the OpenID connect configuration document

 > For more information please browse the Technical Onboarding Guide for Core Service. This is supplied by DEFRA Customer Identity

## Generate a self-signed certificate to run application on https

```
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```

## Running the application

The application is designed to run in containerised environments, using Docker
Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to
run the service with either Docker Compose or Kubernetes.

When using the Docker Compose files in development the local `app` folder will
be mounted on top of the `app` folder within the Docker container, hiding the
CSS files that were generated during the Docker build. For the site to render
correctly locally `npm run build` must be run on the host system.

By default, the start script will build (or rebuild) images so there will
rarely be a need to build images manually. However, this can be achieved
through the Docker Compose
[build](https://docs.docker.com/compose/reference/build/) command:

```sh
# Build container images
docker compose build
```

### Start

Use Docker Compose to run service locally.

```sh
docker compose up
```

or use the start script

```sh
./scripts/start
```

## Test structure

The tests have been structured into subfolders of `./test` as per the
[Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure)

### Running tests

A convenience script is provided to run automated tests in a containerised
environment. This will rebuild images before running tests via docker compose,
using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`.
The command given to `docker compose run` may be customised by passing
arguments to the test script.

Examples:

```sh
# Run all tests
scripts/test

# Run tests with file watch
scripts/test -w
```

## CI pipeline

This service uses the [FFC CI pipeline](https://github.com/DEFRA/ffc-jenkins-pipeline-library)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT
LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and
applications when using this information.

> Contains public sector information licensed under the Open Government license
> v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her
Majesty's Stationery Office (HMSO) to enable information providers in the
public sector to license the use and re-use of their information under a common
open licence.

It is designed to encourage use and re-use of information freely and flexibly,
with only a few conditions.
