import { Authenticator } from 'passport';
import { JwtAuthGuard } from './auth/guards/jwtAuth.guard';
import { AuthModule } from './auth/modules/auth.module';
import { MapCredentials } from './auth/types/mapCredentials';
import { MapCredentialsParams } from './auth/types/mapCredentialsParams';
import {
  SignInEmailPassword,
  SignInEmailPasswordInput
} from './authenticator/signInEmailPassword/signInEmailPassword.authenticator';
import { AnyCredentialsRepresentation } from './credentials/models/types/anyCredentialsRepresentation';
import { CredentialsRepresentation } from './credentials/models/types/credentialsRepresentation';
import { CREDENTIALS_SERVICE } from './credentials/modules/credentials.moduleKeys';
import { CredentialsService } from './credentials/services/credentials.service';
import { CREDENTIALS_STORAGE } from './credentialsStorage/modules/credentialsStorage.moduleKeys';
import { CredentialsStorage } from './credentialsStorage/services/credentialsStorage.service';
import { JWTConfig } from './jwt/models/types/jwtConfig';
import { AnyUserRepresentation } from './user/models/types/anyUserRepresentation';
import { UserRepresentation } from './user/models/types/userRepresentation';
import { USER_SERVICE } from './user/modules/user.moduleKeys';
import { UserService } from './user/services/user.service';
import { USER_STORAGE } from './userStorage/modules/userStorage.moduleKeys';
import { UserStorage } from './userStorage/services/userStorage.service';
import { DatabaseModelOf } from './utils/types/databaseModelOf';
import { Optional } from './utils/types/optional';
import { PromiseOptional } from './utils/types/promiseOptional';
import { PublicModelOf } from './utils/types/publicModelOf';

export {
  AnyCredentialsRepresentation,
  AnyUserRepresentation,
  AuthModule,
  Authenticator,
  CREDENTIALS_SERVICE,
  CREDENTIALS_STORAGE,
  CredentialsRepresentation,
  CredentialsService,
  CredentialsStorage,
  DatabaseModelOf,
  JWTConfig,
  JwtAuthGuard,
  MapCredentials,
  MapCredentialsParams,
  Optional,
  PromiseOptional,
  PublicModelOf,
  SignInEmailPassword,
  SignInEmailPasswordInput,
  USER_SERVICE,
  USER_STORAGE,
  UserRepresentation,
  UserService,
  UserStorage
};
