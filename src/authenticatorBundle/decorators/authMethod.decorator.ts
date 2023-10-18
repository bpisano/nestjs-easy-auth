import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { AuthenticatorBundle } from '../services/authenticatorBundle';

export function AuthMethod<Input, User extends AnyUserRepresentation>() {
  return <T extends AuthenticatorBundle<Input, User>>(constructor: T): void => {
    constructor;
  };
}
