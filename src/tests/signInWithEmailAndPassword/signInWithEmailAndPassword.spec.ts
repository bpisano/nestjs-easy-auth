import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { SignInWithEmailAndPassword } from "../../authenticationMethods/signInWithEmailAndPassword/modules/signInWithEmailAndPassword.module";
import { UserModule } from "../../user/modules/user.module";
import { CredentialsMock } from "../credentials/models/app/credentials.mock";
import { DBCredentialsSchemaMock } from "../credentials/models/db/dbCredentials.mock";
import { TestMongooseModule } from "../memoryServer/modules/memoryServer.module";
import { MemoryServer } from "../memoryServer/services/memoryServer.service";
import { UserMock } from "../user/models/app/user.mock";
import { DBUserSchemaMock } from "../user/models/db/dbUser.mock";

describe("SignInWithEmailAndPassword", () => {
  let app: INestApplication;

  async function setup(): Promise<void> {
    const rootModule: TestingModule = await Test.createTestingModule({
      imports: [
        TestMongooseModule,
        UserModule.mongo({
          mongoConfig: {
            dbName: "user-kit",
            uri: "mongodb://root:rootpassword@127.0.0.1:27017?authMechanism=DEFAULT",
          },
          userSchema: DBUserSchemaMock,
          credentialsSchema: DBCredentialsSchemaMock,
          features: [
            new SignInWithEmailAndPassword({
              mapUser: (email: string, hashedPassword: string) =>
                new UserMock(email, hashedPassword),
              mapCredentials: (userId: string) =>
                new CredentialsMock(userId, "", "", new Date(), new Date()),
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
