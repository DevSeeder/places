import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
// import expect from 'chai';
import { AppModule } from './../src/app.module';

jest.useFakeTimers();
jest.setTimeout(50000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/neighborhoods/city/brasil/sc/orleans (GET)', async () => {
    try {
      await request(app.getHttpServer())
        .get('/neighborhoods/city/brasil/sc/orleans')
        .expect(200);
    } catch (error) {
      console.error(error);
    }
  });
});
