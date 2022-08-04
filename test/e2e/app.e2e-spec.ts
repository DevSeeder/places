import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { expect } from 'chai';
import { AppModule } from '../../src/app.module';
import { NestFactory } from '@nestjs/core';
import '../../src/microservice/adapter/helper/extensions/exensions.module';

jest.setTimeout(400000);

describe('App (e2e) ', () => {
  let app: INestApplication;

  beforeEach(async function () {
    app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true
      })
    );
    await app.init();
  });

  afterEach(async function () {
    await app.close();
  });

  describe('Neighborhood (e2e) ', () => {
    it('/neighborhoods/city/brasil/sc/orleans (GET)', async () => {
      const actual = await request(app.getHttpServer()).get(
        '/neighborhoods/city/brasil/sc/orleans'
      );

      expect(actual.body).to.be.an('array').that.is.not.empty;
    });

    it('/neighborhoods/state/brasil/sc (GET)', async () => {
      const actual = await request(app.getHttpServer()).get(
        '/neighborhoods/state/brasil/sc'
      );
      expect(actual.body).to.be.an('object').that.is.not.empty;
      expect(actual.body.Orleans).to.be.an('array').that.is.not.empty;
    });
  });

  describe('City (e2e) ', () => {
    it('/cities/state/brasil/sc (GET)', async () => {
      const actual = await request(app.getHttpServer()).get(
        '/cities/state/brasil/sc'
      );

      expect(actual.body).to.be.an('array').that.is.not.empty;
    });

    it('/cities/country/brasil (GET)', async () => {
      const actual = await request(app.getHttpServer()).get(
        '/cities/country/brasil'
      );

      expect(actual.body).to.be.an('object').that.is.not.empty;
      expect(actual.body['Santa Catarina - SC']).to.be.an('array').that.is.not
        .empty;
    });
  });

  describe('State (e2e) ', () => {
    it('/states/country/brasil (GET)', async () => {
      const actual = await request(app.getHttpServer()).get(
        '/states/country/brasil'
      );

      expect(actual.body).to.be.an('array').that.is.not.empty;
    });
  });

  describe('Country (e2e) ', () => {
    it('/countries/ (GET)', async () => {
      const actual = await request(app.getHttpServer()).get('/countries/');

      expect(actual.body).to.be.an('array').that.is.not.empty;
    });
  });
});
