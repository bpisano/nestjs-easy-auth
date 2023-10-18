import { Inject, UnauthorizedException } from '@nestjs/common';
import { COMPARE_PASSWORD } from '../../../authenticatorBundle/services/logInEmailPassword/logInEmailPassword.authBundleKeys';
import { AnyUserRepresentation } from '../../../user/models/types/anyUserRepresentation';
import { USER_SERVICE } from '../../../user/modules/user.moduleKeys';
import { UserService } from '../../../user/services/user.service';
import { Optional } from '../../../utils/types/optional';
import { Authenticator } from '../authenticator';
import { LogInEmailPasswordDto } from './logInEmailPassword.dto';

type AdditionnalUserFields = { email: string; hashedPassword?: string };

export class LogInEmailPasswordAuthenticator<User extends AnyUserRepresentation & AdditionnalUserFields>
  implements Authenticator<LogInEmailPasswordDto, User>
{
  public readonly name: string = 'email-password';

  public constructor(
    @Inject(USER_SERVICE) private readonly userService: UserService<User>,
    @Inject(COMPARE_PASSWORD)
    private readonly comparePassword: (inputPassword: string, hashedPassword: string) => Promise<boolean>
  ) {}

  public async authenticate(input: LogInEmailPasswordDto): Promise<User> {
    const user: Optional<User> = await this.userService.getWith({
      email: input.email
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    const isPasswordValid: boolean = await this.comparePassword(input.password, user.hashedPassword ?? '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password.');
    }
    return user;
  }
}
