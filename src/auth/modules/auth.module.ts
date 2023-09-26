import {
  Body,
  Controller,
  DynamicModule,
  Inject,
  Module,
  Post,
  Type,
} from "@nestjs/common";
import { Authenticator } from "../../authenticator/authenticator";
import { AnyCredentialsRepresentation } from "../../credentials/models/types/anyCredentialsRepresentation";
import { CredentialsModule } from "../../credentials/modules/credentials.module";
import { CREDENTIALS_SERVICE } from "../../credentials/modules/credentials.moduleKeys";
import { CredentialsService } from "../../credentials/services/credentials.service";
import { JWTConfig } from "../../jwt/models/types/jwtConfig";
import { MongoConfig } from "../../mongoConfig/models/types/mongoConfig";
import { Session } from "../../session/models/api/session";
import { PublicSession } from "../../session/models/public/publicSession";
import { AnyUserRepresentation } from "../../user/models/types/anyUserRepresentation";
import { UserModule } from "../../user/modules/user.module";
import { USER_SERVICE } from "../../user/modules/user.moduleKeys";
import { UserService } from "../../user/services/user.service";
import { MapCredentials } from "../types/mapCredentials";

@Module({})
export class AuthModule {
  public static mongo<
    Credentials extends AnyCredentialsRepresentation,
    User extends AnyUserRepresentation,
  >(params: {
    mongoConfig: MongoConfig;
    jwtConfig: JWTConfig;
    mapCredentials: MapCredentials<Credentials>;
    authMethods: Authenticator<any, User>[];
  }): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        UserModule.mongo({ config: params.mongoConfig }),
        CredentialsModule.mongo({
          config: params.mongoConfig,
          jwtConfig: params.jwtConfig,
        }),
      ],
      controllers: params.authMethods.map(
        (authenticator: Authenticator<any, User>) =>
          this.createAuthenicatorController(
            authenticator,
            params.mapCredentials,
          ),
      ),
    };
  }

  private static createAuthenicatorController<
    Input,
    Credentials extends AnyCredentialsRepresentation,
    User extends AnyUserRepresentation,
  >(
    authenticator: Authenticator<Input, User>,
    mapCredentials: MapCredentials<Credentials>,
  ): Type<any> {
    @Controller("auth")
    class AuthenticatorController {
      public constructor(
        @Inject(CREDENTIALS_SERVICE)
        private readonly credentialsService: CredentialsService<Credentials>,
        @Inject(USER_SERVICE) private readonly userSservice: UserService<User>,
      ) {}

      @Post(authenticator.path)
      public async authenticate(
        @Body() input: Input,
      ): Promise<PublicSession<Credentials, User>> {
        const user: User = await authenticator.authenticate(
          input,
          this.userSservice,
        );
        const credentials: Credentials = await this.credentialsService.create(
          { userId: user.id, authType: authenticator.authMethod },
          mapCredentials,
        );
        const session: Session<Credentials, User> = new Session(
          credentials,
          user,
        );
        return session.toPublicModel();
      }
    }
    return AuthenticatorController;
  }
}
