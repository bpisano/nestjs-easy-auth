import { Inject } from '@nestjs/common';
import { AUTHENTICATOR } from '../../authenticatorBundle/modules/authenticatorBundle.moduleKeys';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { CREDENTIALS_SERVICE } from '../../credentials/modules/credentials.moduleKeys';
import { CredentialsService } from '../../credentials/services/credentials.service';
import { Session } from '../../session/models/api/session';
import { PublicSession } from '../../session/models/public/publicSession';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { Authenticator } from '../services/authenticator';

export class BaseAuthenticationController<
  Input,
  Credentials extends AnyCredentialsRepresentation,
  User extends AnyUserRepresentation
> {
  public constructor(
    @Inject(AUTHENTICATOR) private readonly authenticator: Authenticator<Input, User>,
    @Inject(CREDENTIALS_SERVICE) private readonly credentialsService: CredentialsService<Credentials>
  ) {}

  protected async authenticate(input: Input): Promise<PublicSession<Credentials, User>> {
    const user: User = await this.authenticator.authenticate(input);
    const credentials: Credentials = await this.credentialsService.create({
      userId: user.id,
      authType: this.authenticator.name
    });
    const session: Session<Credentials, User> = new Session(credentials, user);
    return session.toPublicModel();
  }
}
