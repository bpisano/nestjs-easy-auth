import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';

export interface Authenticator<Input, User extends AnyUserRepresentation> {
  name: string;
  authenticate(input: Input): Promise<User>;
}
