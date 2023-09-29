import { ToPublicModelConvertible } from 'model-conversion';
import { AnyCredentialsRepresentation } from '../../../credentials/models/types/anyCredentialsRepresentation';
import { AnyUserRepresentation } from '../../../user/models/types/anyUserRepresentation';
import { PublicModelOf } from '../../../utils/types/publicModelOf';
import { PublicSession } from '../public/publicSession';

export class Session<Credentials extends AnyCredentialsRepresentation, User extends AnyUserRepresentation>
  implements ToPublicModelConvertible<PublicSession<PublicModelOf<User>, PublicModelOf<Credentials>>>
{
  public constructor(
    public readonly credentials: Credentials,
    public readonly currentUser: User
  ) {}

  public toPublicModel(): PublicSession<PublicModelOf<User>, PublicModelOf<Credentials>> {
    return new PublicSession(this.credentials.toPublicModel(), this.currentUser.toPublicModel());
  }
}
