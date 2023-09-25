import { ConflictException, Inject, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { AnyCredentialsRepresentation } from "../../../credentials/models/types/anyCredentialsRepresentation";
import { CREDENTIALS_STORAGE } from "../../../credentialsStorage/modules/credentialsStorage.moduleKeys";
import { CredentialsStorage } from "../../../credentialsStorage/services/credentialsStorage.service";
import { Session } from "../../../session/models/api/session";
import { AnyUserRepresentation } from "../../../user/models/types/anyUserRepresentation";
import { USER_SERVICE } from "../../../user/modules/user.moduleKeys";
import { UserService } from "../../../user/services/user.service";
import { DatabaseModelOf } from "../../../utils/types/databaseModelOf";
import { Optional } from "../../../utils/types/optional";
import { Authenticator } from "../../authenticator.service";
import { SignInWithEmailAndPasswordMapper } from "../mappers/signInWithEmailAndPassword.mapper";
import { SignInWithEmailAndPasswordDto } from "../models/dto/signInWithEmailAndPassword.dto";
import { SIGN_IN_WITH_EMAIL_AND_PASSWORD_MAPPER } from "../modules/signInWithEmailAndPassword.moduleKeys";

@Injectable()
export class SignInWithEmailAndPasswordAuthenticator<
  Credentials extends AnyCredentialsRepresentation,
  User extends AnyUserRepresentation & {
    email: string;
    hashedPassword: string;
  }
> implements Authenticator<SignInWithEmailAndPasswordDto, Credentials, User>
{
  public constructor(
    @Inject(SIGN_IN_WITH_EMAIL_AND_PASSWORD_MAPPER)
    private readonly mapper: SignInWithEmailAndPasswordMapper<
      Credentials,
      User
    >,
    @Inject(CREDENTIALS_STORAGE)
    private readonly credentialsStorage: CredentialsStorage<Credentials>,
    @Inject(USER_SERVICE) private readonly userService: UserService<User>
  ) {}

  public async authenticate(
    input: SignInWithEmailAndPasswordDto
  ): Promise<Session<Credentials, User>> {
    const user: Optional<User> = await this.userService.getWith({
      email: input.email,
    });
    if (user) {
      throw new ConflictException("User already exists.");
    }
    const hashedPassword: string = await bcrypt.hash(input.password, 10);
    const dbUser: Partial<DatabaseModelOf<User>> = this.mapper.mapUser(
      input.email,
      hashedPassword
    );
    const createdUser: User = await this.userService.create(dbUser);
    const dbCredentials: Partial<DatabaseModelOf<Credentials>> =
      this.mapper.mapCredentials(createdUser.id);
    const createdCredentials: Credentials =
      await this.credentialsStorage.create(dbCredentials);
    return new Session(createdCredentials, createdUser);
  }
}
