import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClassConstructor } from 'class-transformer';
import { AuthenticatorsModule } from '../../authenticator/modules/authenticators.module';
import { AuthenticatorBundle } from '../../authenticatorBundle/services/authenticatorBundle';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { CredentialsModule } from '../../credentials/modules/credentials.module';
import { CredentialsRefreshModule } from '../../credentialsRefresh/modules/credentialsRefresh.module';
import { JWTConfig } from '../../jwt/models/types/jwtConfig';
import { JWTModule } from '../../jwt/modules/jwt.module';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { UserModule } from '../../user/modules/user.module';
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
    models: {
      credentials: ClassConstructor<Credentials>;
      user: ClassConstructor<User>;
    };
    methods: AuthenticatorBundle<any, User>[];
  }): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        EventEmitterModule.forRoot({
          wildcard: true,
          delimiter: '.'
        }),
        JWTModule.withConfig(config.jwtConfig),
        CredentialsModule.withConfiguration({ jwtConfig: config.jwtConfig, model: config.models.credentials }),
        CredentialsRefreshModule.withConfiguration(config),
        UserModule.withConfiguration({ model: config.models.user }),
        AuthenticatorsModule.withBundles(config.methods)
      ],
      providers: [JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }]
    };
  }

  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(InjectUserMiddleware).forRoutes('*');
  }
}
