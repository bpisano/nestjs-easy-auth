import { Optional } from '@nestjs/common';
import { Authenticator } from 'passport';
import { JwtAuthGuard } from './auth/guards/jwtAuth.guard';
import { AuthModule } from './auth/modules/auth.module';
import { MapCredentials } from './auth/types/mapCredentials';
import { SignInEmailPassword } from './authenticator/signInEmailPassword/signInEmailPassword.authenticator';
import { AnyCredentialsRepresentation } from './credentials/models/types/anyCredentialsRepresentation';
import { CREDENTIALS_STORAGE } from './credentialsStorage/modules/credentialsStorage.moduleKeys';
import { CredentialsStorage } from './credentialsStorage/services/credentialsStorage.service';
import { JWTConfig } from './jwt/models/types/jwtConfig';
import { AnyUserRepresentation } from './user/models/types/anyUserRepresentation';
import { USER_STORAGE } from './userStorage/modules/userStorage.moduleKeys';
import { UserStorage } from './userStorage/services/userStorage.service';
import { DatabaseModelOf } from './utils/types/databaseModelOf';
import { PromiseOptional } from './utils/types/promiseOptional';
import { PublicModelOf } from './utils/types/publicModelOf';

export {
  AnyCredentialsRepresentation,
  AnyUserRepresentation,
  AuthModule,
  Authenticator,
  CREDENTIALS_STORAGE,
  CredentialsStorage,
  DatabaseModelOf,
  JWTConfig,
  JwtAuthGuard,
  MapCredentials,
  Optional,
  PromiseOptional,
  PublicModelOf,
  SignInEmailPassword,
  USER_STORAGE,
  UserStorage
};
