import {
  Body,
  Controller,
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  Post,
  Type
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Authenticator } from '../../authenticator/authenticator';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { CredentialsModule } from '../../credentials/modules/credentials.module';
import { CREDENTIALS_SERVICE } from '../../credentials/modules/credentials.moduleKeys';
import { CredentialsService } from '../../credentials/services/credentials.service';
import { CredentialsRefreshModule } from '../../credentialsRefresh/modules/credentialsRefresh.module';
import { JWTConfig } from '../../jwt/models/types/jwtConfig';
import { JWTModule } from '../../jwt/modules/jwt.module';
import { Session } from '../../session/models/api/session';
import { PublicSession } from '../../session/models/public/publicSession';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { UserModule } from '../../user/modules/user.module';
import { USER_SERVICE } from '../../user/modules/user.moduleKeys';
import { UserService } from '../../user/services/user.service';
import { Public } from '../decorators/public.decorator';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { InjectUserMiddleware } from '../middlewares/injectUser.middleware';
import { JwtStrategy } from '../passport/jwt.strategy';
import { MapCredentials } from '../types/mapCredentials';

@Module({})
export class AuthModule implements NestModule {
  public static withConfiguration<
    Credentials extends AnyCredentialsRepresentation,
    User extends AnyUserRepresentation
  >(config: {
    jwtConfig: JWTConfig;
    mapCredentials: MapCredentials<Credentials>;
    authMethods: Authenticator<any, User>[];
  }): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        JWTModule.withConfig(config.jwtConfig),
        CredentialsModule.withConfiguration({ jwtConfig: config.jwtConfig }),
        UserModule.forRoot(),
        CredentialsRefreshModule.withConfiguration({
          jwtConfig: config.jwtConfig,
          mapCredentials: config.mapCredentials
        })
      ],
      providers: [JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
      controllers: config.authMethods.map((authenticator: Authenticator<any, User>) =>
        this.createAuthenicatorController(authenticator, config.mapCredentials)
      )
    };
  }

  private static createAuthenicatorController<
    Input,
    Credentials extends AnyCredentialsRepresentation,
    User extends AnyUserRepresentation
  >(authenticator: Authenticator<Input, User>, mapCredentials: MapCredentials<Credentials>): Type<any> {
    @Controller('auth')
    class AuthenticatorController {
      public constructor(
        @Inject(CREDENTIALS_SERVICE)
        private readonly credentialsService: CredentialsService<Credentials>,
        @Inject(USER_SERVICE) private readonly userSservice: UserService<User>
      ) {}

      @Public()
      @Post(authenticator.path)
      public async authenticate(@Body() input: Input): Promise<PublicSession<Credentials, User>> {
        const user: User = await authenticator.authenticate(input, this.userSservice);
        const credentials: Credentials = await this.credentialsService.create(
          { userId: user.id, authType: authenticator.authMethod },
          mapCredentials
        );
        const session: Session<Credentials, User> = new Session(credentials, user);
        return session.toPublicModel();
      }
    }
    return AuthenticatorController;
  }

  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(InjectUserMiddleware).forRoutes('*');
  }
}
