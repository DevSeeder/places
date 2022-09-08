<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
[url-prod]: http://places.devseeder.com/api

  <p align="center">This project use <a href="https://github.com/nestjs/nest" target="_blank">NestJS</a>, a progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Technologies

<ul>
  <li>NestJS</li>
  <li>NodeJS</li>
  <li>Puppeteer</li>
  <li>MongoDB</li>
  <li>RabbitMQ</li>
  <li>JWT Auth</li>
</ul>

## Description

API to get Places by Local Names.

- Neighborhoods
- Cities
- States
- Regions
- Countries

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

<!-- ## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE). -->

## Contact

maicksantos05@hotmail.com

## Example

After run the server, make a get in browser, postman or similar

```bash
## Neighborhoods By City example
http://places.devseeder.com/api/neighborhoods/city/brazil/sc/orleans
## Neighborhoods By State example
http://places.devseeder.com/api/neighborhoods/city/brazil/sc
## Cities By State example
http://places.devseeder.com/api/cities/state/brazil/sc
## Cities By Country example
http://places.devseeder.com/api/cities/country/brazil
## States By Country example
http://places.devseeder.com/api/states/country/brazil
## Countries example
http://places.devseeder.com/api/countries/
```

[Swagger](https://app.swaggerhub.com/apis/dev-seeder/Places/)

At the moment, it's working only for Brazilians Neighborhoods.
