import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AuthModule } from "../../auth/modules/auth.module";
import { MapCredentialsParams } from "../../auth/types/mapCredentialsParams";
import {
  SignInEmailPassword,
  SignInEmailPasswordUserMapInput,
} from "../../authenticator/signInEmailPassword/signInEmailPassword.authenticator";
import { CredentialsMock } from "../credentials/models/app/credentials.mock";
import { DBCredentialsSchemaMock } from "../credentials/models/db/dbCredentials.mock";
import { TestMongooseModule } from "../memoryServer/modules/memoryServer.module";
import { MemoryServer } from "../memoryServer/services/memoryServer.service";
import { UserMock } from "../user/models/app/user.mock";
import { DBUserSchemaMock } from "../user/models/db/dbUser.mock";

describe("SignInEmailPassword", () => {
  let app: INestApplication;

  async function setup(): Promise<void> {
    const rootModule: TestingModule = await Test.createTestingModule({
      imports: [
        TestMongooseModule,

        AuthModule.mongo<CredentialsMock, UserMock>({
          mongoConfig: {
            dbName: "user-kit",
            uri: "mongodb://root:rootpassword@127.0.0.1:27017?authMechanism=DEFAULT",
            userSchema: DBUserSchemaMock,
            credentialsSchema: DBCredentialsSchemaMock,
          },
          jwtConfig: {
            secret: "secret",
            accessTokenExpiresIn: "1h",
            refreshTokenExpiresIn: "1d",
          },
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

    it("test", async () => {
      const response: request.Response = await request(app.getHttpServer())
        .post("/auth/signin")
        .send({
          email: "test@test.com",
          password: "testpassword",
        });
      console.log(response.body);
      expect(response.status).toBe(201);
    });
  });
});
