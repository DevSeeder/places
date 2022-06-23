import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { expect } from 'chai';
import { AppModule } from '../../src/app.module';
import { NestFactory } from '@nestjs/core';
import '../../src/microservice/adapter/helper/extensions/exensions.module';

jest.setTimeout(50000);

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
  });
});
