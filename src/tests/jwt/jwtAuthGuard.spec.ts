import { Controller, Get, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../../auth/modules/auth.module';
import { MapCredentialsParams } from '../../auth/types/mapCredentialsParams';
import {
  SignInEmailPassword,
  SignInEmailPasswordInput
} from '../../authenticator/signInEmailPassword/signInEmailPassword.authenticator';
import { TestAuthModule } from '../auth/modules/testAuth.module';
import { CredentialsMock } from '../credentialsStorage/models/app/credentials.mock';
import { UserMock } from '../userStorage/models/app/user.mock';
import { jwtConfigMock } from './models/jwtConfig.mock';

@Controller()
class TestController {
  @Get('private')
  public privateRoute(): void {
    return;
  }
}

describe('JwtAuthGuard', () => {
  let app: INestApplication;

  async function setup(): Promise<void> {
    const rootModule: TestingModule = await Test.createTestingModule({
      imports: [
        TestAuthModule,
        AuthModule.withConfiguration({
          jwtConfig: jwtConfigMock,
          mapCredentials: (params: MapCredentialsParams) => CredentialsMock.fromMapCredentials(params),
          authMethods: [
            new SignInEmailPassword({
              mapUser: (input: SignInEmailPasswordInput) => UserMock.fromSignInEmailPassword(input)
            })
          ]
        })
      ],
      controllers: [TestController]
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

    it('Should access private route with valid credentials.', async () => {
      const email: string = 'test@test.com';
      const signInResponse: request.Response = await request(app.getHttpServer()).post('/auth/signin').send({
        email,
        password: 'testpassword'
      });
      const accessToken: string = signInResponse.body.credentials.accessToken;
      const testControllerResponse: request.Response = await request(app.getHttpServer())
        .get('/private')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(testControllerResponse.status).toBe(200);
    });
  });

  describe('Failure', () => {
    beforeEach(setup);
    afterEach(teardown);

    it('Should not access private route with invalid credentials.', async () => {
      const testControllerResponse: request.Response = await request(app.getHttpServer()).get('/private');
      expect(testControllerResponse.status).toBe(HttpStatus.FORBIDDEN);
    });
  });
});
