import { AnyUserRepresentation } from '../user/models/types/anyUserRepresentation';
import { UserService } from '../user/services/user.service';

export interface Authenticator<Input, User extends AnyUserRepresentation> {
  authMethod: string;
  path: string;
  authenticate(input: Input, userService: UserService<User>): Promise<User>;
}
