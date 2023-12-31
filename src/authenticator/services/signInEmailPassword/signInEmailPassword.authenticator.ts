import { ConflictException, Inject } from '@nestjs/common';
import { HASH_PASSWORD } from '../../../authenticatorBundle/services/signInEmailPassword/signInEmailPassword.authBundleKeys';
import { MODEL_PROVIDER } from '../../../modelProvider/modules/modelProvider.moduleKeys';
import { UserModelProvider } from '../../../modelProvider/services/modelProvider';
import { AnyUserRepresentation } from '../../../user/models/types/anyUserRepresentation';
import { USER_SERVICE } from '../../../user/modules/user.moduleKeys';
import { UserService } from '../../../user/services/user.service';
import { DatabaseModelOf } from '../../../utils/types/databaseModelOf';
import { Optional } from '../../../utils/types/optional';
import { Authenticator } from '../authenticator';
import { SignInEmailPasswordDto } from './signInEmailPassword.dto';

type AdditionnalUserFields = { email: string; hashedPassword?: string };

export class SignInEmailPasswordAuthenticator<User extends AnyUserRepresentation & AdditionnalUserFields>
  implements Authenticator<SignInEmailPasswordDto, User>
{
  public readonly name: string = 'email-password';

  public constructor(
    @Inject(MODEL_PROVIDER) private readonly modelProvider: UserModelProvider<User>,
    @Inject(USER_SERVICE) private readonly userService: UserService<User>,
    @Inject(HASH_PASSWORD) private readonly hashPassword: (password: string) => Promise<string>
  ) {}

  public async authenticate(input: SignInEmailPasswordDto): Promise<User> {
    await this.checkUserExistence(input.email);
    const hashedPassword: string = await this.hashPassword(input.password);
    const user: User = this.modelProvider.provideUser({
      email: input.email,
      hashedPassword
    });
    const dbUser: Partial<DatabaseModelOf<User>> = user.toDatabaseModel();
    return await this.userService.create(dbUser);
  }

  private async checkUserExistence(email: string): Promise<void> {
    const user: Optional<User> = await this.userService.getWith({
      email: email
    });
    if (user) {
      throw new ConflictException('User already exists.');
    }
  }
}
