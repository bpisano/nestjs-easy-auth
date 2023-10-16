import { Controller, Get, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../../auth/modules/auth.module';
import { MapCredentialsParams } from '../../auth/types/mapCredentialsParams';
import {
  SignInEmailPassword,
  SignInEmailPasswordInput
} from '../../authenticator/signInEmailPassword/signInEmailPassword.authenticator';
import { CredentialsMock } from '../../utils/tests/credentials/models/app/credentials.mock';
import { jwtConfigMock } from '../../utils/tests/jwtConfig/jwtConfig.mock';
import { TestMongooseModule } from '../../utils/tests/memoryServer/modules/memoryServer.module';
import { MemoryServer } from '../../utils/tests/memoryServer/services/memoryServer.service';
import { mongoConfigMock } from '../../utils/tests/mongoConfig/mongoConfig.mock';
import { UserMock } from '../../utils/tests/user/models/app/user.mock';

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
        TestMongooseModule,
        AuthModule.mongo({
          mongoConfig: mongoConfigMock,
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
    await MemoryServer.getInstance().stop();
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
