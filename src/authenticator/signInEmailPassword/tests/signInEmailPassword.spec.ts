import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../../../auth/modules/auth.module';
import { MapCredentialsParams } from '../../../auth/types/mapCredentialsParams';
import { USER_SERVICE } from '../../../user/modules/user.moduleKeys';
import { UserService } from '../../../user/services/user.service';
import { CredentialsMock } from '../../../utils/tests/credentials/models/app/credentials.mock';
import { jwtConfigMock } from '../../../utils/tests/jwtConfig/jwtConfig.mock';
import { TestMongooseModule } from '../../../utils/tests/memoryServer/modules/memoryServer.module';
import { MemoryServer } from '../../../utils/tests/memoryServer/services/memoryServer.service';
import { mongoConfigMock } from '../../../utils/tests/mongoConfig/mongoConfig.mock';
import { UserMock } from '../../../utils/tests/user/models/app/user.mock';
import { Optional } from '../../../utils/types/optional';
import { SignInEmailPassword, SignInEmailPasswordInput } from '../signInEmailPassword.authenticator';

describe('SignInEmailPassword', () => {
  let app: INestApplication;
  let userService: UserService<UserMock>;

  async function setup(): Promise<void> {
    const rootModule: TestingModule = await Test.createTestingModule({
      imports: [
        TestMongooseModule,
        AuthModule.mongo<CredentialsMock, UserMock>({
          mongoConfig: mongoConfigMock,
          jwtConfig: jwtConfigMock,
          mapCredentials: (params: MapCredentialsParams) => CredentialsMock.fromMapCredentials(params),
          authMethods: [
            new SignInEmailPassword({
              mapUser: (input: SignInEmailPasswordInput) => UserMock.fromSignInEmailPassword(input)
            })
          ]
        })
      ]
    }).compile();
    userService = rootModule.get(USER_SERVICE);

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

    it('Should create a new user.', async () => {
      const email: string = 'test@test.com';
      const response: request.Response = await request(app.getHttpServer()).post('/auth/signin').send({
        email,
        password: 'testpassword'
      });
      const userId: string = response.body.current_user.id;
      const user: Optional<UserMock> = await userService.getWithId(userId);
      expect(user).toBeDefined();
      expect(user?.email).toBe(email);
      expect(response.status).toBe(201);
    });
  });
});
