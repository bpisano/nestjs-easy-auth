import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AuthModule } from "../../auth/modules/auth.module";
import { MapCredentialsParams } from "../../auth/types/mapCredentialsParams";
import {
  SignInEmailPassword,
  SignInEmailPasswordUserMapInput,
} from "../../authenticator/signInEmailPassword/signInEmailPassword.authenticator";
import { CREDENTIALS_SERVICE } from "../../credentials/modules/credentials.moduleKeys";
import { CredentialsService } from "../../credentials/services/credentials.service";
import { CredentialsMock } from "../../tests/credentials/models/app/credentials.mock";
import { jwtConfigMock } from "../../tests/jwtConfig/jwtConfig.mock";
import { TestMongooseModule } from "../../tests/memoryServer/modules/memoryServer.module";
import { MemoryServer } from "../../tests/memoryServer/services/memoryServer.service";
import { mongoConfigMock } from "../../tests/mongoConfig/mongoConfig.mock";
import { UserMock } from "../../tests/user/models/app/user.mock";

describe("CredentialsRefresh", () => {
  let app: INestApplication;
  let credentialsService: CredentialsService<CredentialsMock>;

  async function setup(): Promise<void> {
    const rootModule: TestingModule = await Test.createTestingModule({
      imports: [
        TestMongooseModule,
        AuthModule.mongo({
          mongoConfig: mongoConfigMock,
          jwtConfig: jwtConfigMock,
          mapCredentials: (params: MapCredentialsParams) =>
            CredentialsMock.fromMapCredentials(params),
          authMethods: [
            new SignInEmailPassword({
              mapUser: (input: SignInEmailPasswordUserMapInput) =>
                UserMock.fromSignInEmailPassword(input),
            }),
          ],
        }),
      ],
    }).compile();
    credentialsService = rootModule.get(CREDENTIALS_SERVICE);

    app = rootModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  }

  async function teardown(): Promise<void> {
    await MemoryServer.getInstance().stop();
    await app.close();
  }

  describe("Success", () => {
    beforeEach(setup);
    afterEach(teardown);

    it("Should refresh credentials.", async () => {
      const email: string = "test@test.com";
      const signInResponse: request.Response = await request(
        app.getHttpServer(),
      )
        .post("/auth/signin")
        .send({
          email,
          password: "testpassword",
        });
      const userId: string = signInResponse.body.current_user.id;
      const refreshToken: string = signInResponse.body.credentials.refreshToken;
      const refreshResponse: request.Response = await request(
        app.getHttpServer(),
      )
        .post("/auth/refresh")
        .send({
          refresh_token: refreshToken,
        });
      const credentials: CredentialsMock[] =
        await credentialsService.getWithUserId(userId);
      expect(credentials.length).toBe(1);
      expect(refreshResponse.status).toBe(201);
    });
  });
});
