import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AuthModule } from "../../../auth/modules/auth.module";
import { MapCredentialsParams } from "../../../auth/types/mapCredentialsParams";
import { CredentialsMock } from "../../../tests/credentials/models/app/credentials.mock";
import { jwtConfigMock } from "../../../tests/jwtConfig/jwtConfig.mock";
import { TestMongooseModule } from "../../../tests/memoryServer/modules/memoryServer.module";
import { MemoryServer } from "../../../tests/memoryServer/services/memoryServer.service";
import { mongoConfigMock } from "../../../tests/mongoConfig/mongoConfig.mock";
import { UserMock } from "../../../tests/user/models/app/user.mock";
import { USER_SERVICE } from "../../../user/modules/user.moduleKeys";
import { UserService } from "../../../user/services/user.service";
import { Optional } from "../../../utils/types/optional";
import {
  SignInEmailPassword,
  SignInEmailPasswordUserMapInput,
} from "../signInEmailPassword.authenticator";

describe("SignInEmailPassword", () => {
  let app: INestApplication;
  let userService: UserService<UserMock>;

  async function setup(): Promise<void> {
    const rootModule: TestingModule = await Test.createTestingModule({
      imports: [
        TestMongooseModule,
        AuthModule.mongo<CredentialsMock, UserMock>({
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
    userService = rootModule.get(USER_SERVICE);

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

    it("Should create a new user.", async () => {
      const email: string = "test@test.com";
      const response: request.Response = await request(app.getHttpServer())
        .post("/auth/signin")
        .send({
          email,
          password: "testpassword",
        });
      const userId: string = response.body.current_user.id;
      const user: Optional<UserMock> = await userService.getWithId(userId);
      expect(user).toBeDefined();
      expect(user?.email).toBe(email);
      expect(response.status).toBe(201);
    });
  });
});
