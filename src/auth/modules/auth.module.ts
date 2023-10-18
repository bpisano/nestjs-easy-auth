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
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { ClassConstructor } from 'class-transformer';
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

@Module({})
export class AuthModule implements NestModule {
  public static withConfiguration<
    Credentials extends AnyCredentialsRepresentation,
    User extends AnyUserRepresentation
  >(config: {
    jwtConfig: JWTConfig;
    credentialsModel: ClassConstructor<Credentials>;
    authMethods: Authenticator<any, User>[];
  }): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        EventEmitterModule.forRoot({
          wildcard: true,
          delimiter: '.'
        }),
        JWTModule.withConfig(config.jwtConfig),
        CredentialsModule.withConfiguration({ jwtConfig: config.jwtConfig, model: config.credentialsModel }),
        UserModule.forRoot(),
        CredentialsRefreshModule.withConfiguration({
          jwtConfig: config.jwtConfig,
          model: config.credentialsModel
        })
      ],
      providers: [JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
      controllers: config.authMethods.map((authenticator: Authenticator<any, User>) =>
        this.createAuthenicatorController(authenticator)
      )
    };
  }

  private static createAuthenicatorController<
    Input,
    Credentials extends AnyCredentialsRepresentation,
    User extends AnyUserRepresentation
  >(authenticator: Authenticator<Input, User>): Type<any> {
    @Controller('auth')
    class AuthenticatorController {
      public constructor(
        private readonly eventEmitter: EventEmitter2,
        @Inject(CREDENTIALS_SERVICE)
        private readonly credentialsService: CredentialsService<Credentials>,
        @Inject(USER_SERVICE) private readonly userSservice: UserService<User>
      ) {}

      @Public()
      @Post(authenticator.path)
      public async authenticate(@Body() input: Input): Promise<PublicSession<Credentials, User>> {
        const user: User = await authenticator.authenticate(input, this.userSservice);
        const credentials: Credentials = await this.credentialsService.create({
          userId: user.id,
          authType: authenticator.authMethod
        });
        const session: Session<Credentials, User> = new Session(credentials, user);
        this.eventEmitter.emit(`auth.${authenticator.path}`, {
          input: input,
          session
        });
        return session.toPublicModel();
      }
    }
    return AuthenticatorController;
  }

  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(InjectUserMiddleware).forRoutes('*');
  }
}
