import { Type } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthenticationController } from '../../../authenticator/controllers/authenticator.controller';
import { SignInEmailPasswordAuthenticator } from '../../../authenticator/services/signInEmailPassword/signInEmailPassword.authenticator';
import { SignInEmailPasswordDto } from '../../../authenticator/services/signInEmailPassword/signInEmailPassword.dto';
import { AnyUserRepresentation } from '../../../user/models/types/anyUserRepresentation';
import { AuthMethod } from '../../decorators/authMethod.decorator';
import { BundleController } from '../../types/bundleController';
import { BundleProviders } from '../../types/bundleProviders';
import { AuthenticatorBundle } from '../authenticatorBundle';
import { HASH_PASSWORD } from './signInEmailPassword.authBundleKeys';

type AdditionnalUserFields = { email: string; hashedPassword?: string };

export class SignInEmailPassword {
  public static bcryptHash: (password: string) => Promise<string> = async (password: string) => {
    return bcrypt.hash(password, 10);
  };

  public static forRoot<User extends AnyUserRepresentation & AdditionnalUserFields>(
    params: {
      hashPassword: (password: string) => Promise<string>;
    } = {
      hashPassword: SignInEmailPassword.bcryptHash
    }
  ): AuthenticatorBundle<SignInEmailPasswordDto, User> {
    @AuthMethod<SignInEmailPasswordDto, User>()
    class SignInEmailPassword {
      public static authenticator: Type<SignInEmailPasswordAuthenticator<User>> =
        SignInEmailPasswordAuthenticator<User>;
      public static controller: BundleController = AuthenticationController.withPath('signin');
      public static providers: BundleProviders = [{ provide: HASH_PASSWORD, useValue: params.hashPassword }];
    }
    return SignInEmailPassword;
  }
}
