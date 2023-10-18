import { Type } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthenticationController } from '../../../authenticator/controllers/authenticator.controller';
import { LogInEmailPasswordAuthenticator } from '../../../authenticator/services/logInEmailPassword/logInEmailPassword.authenticator';
import { SignInEmailPasswordDto } from '../../../authenticator/services/signInEmailPassword/signInEmailPassword.dto';
import { AnyUserRepresentation } from '../../../user/models/types/anyUserRepresentation';
import { AuthMethod } from '../../decorators/authMethod.decorator';
import { BundleController } from '../../types/bundleController';
import { BundleProviders } from '../../types/bundleProviders';
import { AuthenticatorBundle } from '../authenticatorBundle';
import { COMPARE_PASSWORD } from './logInEmailPassword.authBundleKeys';

type AdditionnalUserFields = { email: string; hashedPassword?: string };

export class LogInEmailPassword {
  public static bcryptPasswordComparison: (inputPassword: string, hashedPassword: string) => Promise<boolean> = async (
    inputPassword: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return await bcrypt.compare(inputPassword, hashedPassword);
  };

  public static forRoot<User extends AnyUserRepresentation & AdditionnalUserFields>(
    params: {
      comparePassword: (inputPassword: string, hashedPassword: string) => Promise<boolean>;
    } = {
      comparePassword: this.bcryptPasswordComparison
    }
  ): AuthenticatorBundle<SignInEmailPasswordDto, User> {
    @AuthMethod<SignInEmailPasswordDto, User>()
    class LogInEmailPassword {
      public static authenticator: Type<LogInEmailPasswordAuthenticator<User>> = LogInEmailPasswordAuthenticator<User>;
      public static controller: BundleController = AuthenticationController.withPath('login');
      public static providers: BundleProviders = [{ provide: COMPARE_PASSWORD, useValue: params.comparePassword }];
    }
    return LogInEmailPassword;
  }
}
