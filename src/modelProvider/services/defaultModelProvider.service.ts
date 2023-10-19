import { ClassConstructor, plainToInstance } from 'class-transformer';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';

export class DefaultModelProvider<
  Credentials extends AnyCredentialsRepresentation,
  User extends AnyUserRepresentation
> {
  private constructor(
    private readonly credentialsModel: ClassConstructor<Credentials>,
    private readonly userModel: ClassConstructor<User>
  ) {}

  public static withModels<
    Credentials extends AnyCredentialsRepresentation,
    User extends AnyUserRepresentation
  >(params: {
    credentials: ClassConstructor<Credentials>;
    user: ClassConstructor<User>;
  }): DefaultModelProvider<Credentials, User> {
    return new DefaultModelProvider(params.credentials, params.user);
  }

  public provideCredentials(params: Partial<Credentials>): Credentials {
    return plainToInstance(this.credentialsModel, params);
  }

  public provideUser(params: Partial<User>): User {
    return plainToInstance(this.userModel, params);
  }
}
