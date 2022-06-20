// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { expect } from 'chai';
// import { AppModule } from '../../src/app.module';
// import { Test } from '@nestjs/testing';
// import { Connection } from 'mongoose';
// import { getConnectionToken } from '@nestjs/mongoose';

// jest.useFakeTimers();
// jest.setTimeout(25000);

// describe('App (e2e)', () => {
//   let app: INestApplication;
//   let connection: Connection;

//   // const url = `mongodb://dev-seeder-root:hpYpxyjrKExNQviu@devseeder-shard-00-00.v6xtv.mongodb.net:27017,devseeder-shard-00-01.v6xtv.mongodb.net:27017,devseeder-shard-00-02.v6xtv.mongodb.net:27017/places?ssl=true&replicaSet=atlas-4xi3m3-shard-0&authSource=admin&retryWrites=true&w=majority`;

//   beforeAll(async () => {
//     const module = await Test.createTestingModule({
//       imports: [AppModule]
//     }).compile();

//     connection = await module.get(getConnectionToken());

//     app = await module.createNestApplication();
//     await app.init();
//   });

//   afterEach(async () => {
//     await app.close();
//   });

//   afterAll(async () => {
//     await connection.close(/*force:*/ true); // <-- important
//   });

//   it('1 = 1', async () => {
//     expect(1).to.be.equal(1);
//   });

//   it('/neighborhoods/city/brasil/sc/orleans (GET)', async () => {
//     const actual = await request(app.getHttpServer())
//       .get('/neighborhoods/city/brasil/sc/orleans')
//       .expect(200);

//     expect(actual.body).to.be.an('array').that.is.not.empty;
//   });
// });
