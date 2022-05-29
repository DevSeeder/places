import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../../src/app.module';
import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';
import { expect } from 'chai';
import * as request from 'supertest';

describe('NewStageForEmptyMovesInterfaceModule', () => {
  let application: INestApplication;

  beforeEach(async function () {
    application = await NestFactory.create(AppModule);
    application.init();
  });

  afterEach(async function () {
    application.close();
  });

  describe('#endpoint /', function () {
    describe('GET /', function () {
      it('should verify if default service returns 404', function (done) {
        request(application.getHttpServer())
          .get('/')
          .end(function (err, res) {
            expect(res.status).to.be.equal(404);
            done(err);
          });
      });
    });
  });
});
