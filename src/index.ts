import { Authenticator } from 'passport';
import { Public } from './auth/decorators/public.decorator';
import { JwtAuthGuard } from './auth/guards/jwtAuth.guard';
import { AuthModule } from './auth/modules/auth.module';
import { AuthenticationController } from './authenticator/controllers/authenticator.controller';
import { BaseAuthenticationController } from './authenticator/controllers/baseAuthentication.controller';
import { LogInEmailPasswordDto } from './authenticator/services/logInEmailPassword/logInEmailPassword.dto';
import { SignInEmailPasswordDto } from './authenticator/services/signInEmailPassword/signInEmailPassword.dto';
import { AuthMethod } from './authenticatorBundle/decorators/authMethod.decorator';
import { AuthenticatorBundle } from './authenticatorBundle/services/authenticatorBundle';
import { LogInEmailPassword } from './authenticatorBundle/services/logInEmailPassword/logInEmailPassword.authBundle';
import { SignInEmailPassword } from './authenticatorBundle/services/signInEmailPassword/signInEmailPassword.authBundle';
import { BundleController } from './authenticatorBundle/types/bundleController';
import { BundleImports } from './authenticatorBundle/types/bundleImports';
import { BundleProviders } from './authenticatorBundle/types/bundleProviders';
import { AnyCredentialsRepresentation } from './credentials/models/types/anyCredentialsRepresentation';
import { CredentialsRepresentation } from './credentials/models/types/credentialsRepresentation';
import { CREDENTIALS_SERVICE } from './credentials/modules/credentials.moduleKeys';
import { CredentialsService } from './credentials/services/credentials.service';
import { CREDENTIALS_STORAGE } from './credentialsStorage/modules/credentialsStorage.moduleKeys';
import { CredentialsStorage } from './credentialsStorage/services/credentialsStorage.service';
import { JWTConfig } from './jwt/models/types/jwtConfig';
import { DefaultModelProvider } from './modelProvider/services/defaultModelProvider.service';
import { CredentialsModelProvider, ModelProvider, UserModelProvider } from './modelProvider/services/modelProvider';
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
  AuthMethod,
  AuthModule,
  AuthenticationController,
  Authenticator,
  AuthenticatorBundle,
  BaseAuthenticationController,
  BundleController,
  BundleImports,
  BundleProviders,
  CREDENTIALS_SERVICE,
  CREDENTIALS_STORAGE,
  CredentialsModelProvider,
  CredentialsRepresentation,
  CredentialsService,
  CredentialsStorage,
  DatabaseModelOf,
  DefaultModelProvider,
  JWTConfig,
  JwtAuthGuard,
  LogInEmailPassword,
  LogInEmailPasswordDto,
  ModelProvider,
  Optional,
  PromiseOptional,
  Public,
  PublicModelOf,
  SignInEmailPassword,
  SignInEmailPasswordDto,
  USER_SERVICE,
  USER_STORAGE,
  UserModelProvider,
  UserRepresentation,
  UserService,
  UserStorage
};
