import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DefaultModelProvider, SignInEmailPassword } from '../..';
import { AuthModule } from '../../auth/modules/auth.module';
import { LogInEmailPassword } from '../../authenticatorBundle/services/logInEmailPassword/logInEmailPassword.authBundle';
import { AuthTestDatabaseProviderModule } from '../auth/modules/authTestDatabaseProvider.module';
import { CredentialsMock } from '../credentialsStorage/models/app/credentials.mock';
import { jwtConfigMock } from '../jwt/models/jwtConfig.mock';
import { UserMock } from '../userStorage/models/app/user.mock';

describe('LogInEmailPassword', () => {
  let app: INestApplication;

  async function setup(): Promise<void> {
    const rootModule: TestingModule = await Test.createTestingModule({
      imports: [
        AuthTestDatabaseProviderModule,
        AuthModule.withConfiguration({
          jwtConfig: jwtConfigMock,
          modelProvider: DefaultModelProvider.withModels({
            credentials: CredentialsMock,
            user: UserMock
          }),
          methods: [SignInEmailPassword.forRoot(), LogInEmailPassword.forRoot()]
        })
      ]
    }).compile();

    app = rootModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  }

  async function teardown(): Promise<void> {
    await app.close();
  }

  describe('Success', () => {
    beforeEach(setup);
    afterEach(teardown);

    it('Login using a previously created password', async () => {
      const email: string = 'test@test.com';
      const password: string = 'testpassword';
      const signInResponse: request.Response = await request(app.getHttpServer()).post('/auth/signin').send({
        email,
        password
      });
      const logInResponse: request.Response = await request(app.getHttpServer()).post('/auth/login').send({
        email,
        password
      });
      expect(logInResponse.body.credentials.authType).toEqual(signInResponse.body.credentials.authType);
      expect(logInResponse.body.current_user.email).toEqual(signInResponse.body.current_user.email);
    });
  });

  describe('Failure', () => {
    beforeEach(setup);
    afterEach(teardown);

    it('Should not login with a wrong password', async () => {
      const email: string = 'test@test.com';
      const password: string = 'testpassword';
      await request(app.getHttpServer()).post('/auth/signin').send({
        email,
        password
      });
      const logInResponse: request.Response = await request(app.getHttpServer()).post('/auth/login').send({
        email,
        password: 'wrongpassword'
      });
      expect(logInResponse.status).toEqual(401);
    });

    it('Should not login if the user does not exists', async () => {
      const email: string = 'test@test.com';
      const password: string = 'testpassword';
      const logInResponse: request.Response = await request(app.getHttpServer()).post('/auth/login').send({
        email,
        password
      });
      expect(logInResponse.status).toEqual(401);
    });
  });
});
