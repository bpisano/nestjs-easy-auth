import { ConflictException } from '@nestjs/common';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { UserService } from '../../user/services/user.service';
import { DatabaseModelOf } from '../../utils/types/databaseModelOf';
import { Optional } from '../../utils/types/optional';
import { Authenticator } from '../authenticator';

export type SignInEmailPasswordInput = { email: string; password: string };

export class SignInEmailPassword<User extends AnyUserRepresentation>
  implements Authenticator<SignInEmailPasswordInput, User>
{
  public readonly authMethod: string = 'emailAndPassword';
  public readonly path: string = 'signin';
  public readonly mapUser: (input: SignInEmailPasswordInput) => Partial<DatabaseModelOf<User>>;

  public constructor(params: { mapUser: (input: SignInEmailPasswordInput) => Partial<DatabaseModelOf<User>> }) {
    this.mapUser = params.mapUser;
  }

  public async authenticate(input: SignInEmailPasswordInput, userService: UserService<User>): Promise<User> {
    await this.checkUserExistence(input.email, userService);
    const dbUser: Partial<DatabaseModelOf<User>> = this.mapUser(input);
    return await userService.create(dbUser);
  }

  private async checkUserExistence(email: string, userService: UserService<User>): Promise<void> {
    const user: Optional<User> = await userService.getWith({
      email: email
    });
    if (user) {
      throw new ConflictException('User already exists.');
    }
  }
}
