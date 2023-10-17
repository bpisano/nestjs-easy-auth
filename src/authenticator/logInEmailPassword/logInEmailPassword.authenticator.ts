import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { UserService } from '../../user/services/user.service';
import { Optional } from '../../utils/types/optional';
import { Authenticator } from '../authenticator';
import { SignInEmailPasswordInput } from '../signInEmailPassword/signInEmailPassword.authenticator';

export type LogInEmailPasswordInput = { email: string; password: string };

export class LogInEmailPassword<User extends AnyUserRepresentation & { email: string; hashedPassword?: string }>
  implements Authenticator<LogInEmailPasswordInput, User>
{
  public readonly authMethod: string = 'emailAndPassword';
  public readonly path: string = 'login';

  public async authenticate(input: SignInEmailPasswordInput, userService: UserService<User>): Promise<User> {
    const user: Optional<User> = await userService.getWith({
      email: input.email
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    const isPasswordValid: boolean = await bcrypt.compare(input.password, user.hashedPassword ?? '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password.');
    }
    return user;
  }
}
