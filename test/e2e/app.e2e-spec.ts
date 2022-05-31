import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { expect } from 'chai';
import { AppModule } from '../../src/app.module';
import { NestFactory } from '@nestjs/core';

jest.useFakeTimers();
jest.setTimeout(50000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await NestFactory.create(AppModule);
    app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/neighborhoods/city/brasil/sc/orleans (GET)', async () => {
    const actual = await request(app.getHttpServer())
      .get('/neighborhoods/city/brasil/sc/orleans')
      .expect(200);

    expect(actual.body).to.be.an('array').that.is.not.empty;
  });
});
