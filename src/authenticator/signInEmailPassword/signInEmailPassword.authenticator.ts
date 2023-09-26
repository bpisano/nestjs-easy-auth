import { ConflictException } from "@nestjs/common";
import bcrypt from "bcrypt";
import { AnyUserRepresentation } from "../../user/models/types/anyUserRepresentation";
import { UserService } from "../../user/services/user.service";
import { DatabaseModelOf } from "../../utils/types/databaseModelOf";
import { Optional } from "../../utils/types/optional";
import { Authenticator } from "../authenticator";

export type SignInEmailPasswordInput = { email: string; password: string };
export type SignInEmailPasswordUserMapInput = {
  email: string;
  hashedPassword: string;
};

export class SignInEmailPassword<User extends AnyUserRepresentation>
  implements Authenticator<SignInEmailPasswordInput, User>
{
  public readonly authMethod: string = "emailAndPassword";
  public readonly path: string = "signin";
  public readonly mapUser: (
    input: SignInEmailPasswordUserMapInput,
  ) => Partial<DatabaseModelOf<User>>;

  public constructor(params: {
    mapUser: (
      input: SignInEmailPasswordUserMapInput,
    ) => Partial<DatabaseModelOf<User>>;
  }) {
    this.mapUser = params.mapUser;
  }

  public async authenticate(
    input: SignInEmailPasswordInput,
    userService: UserService<User>,
  ): Promise<User> {
    await this.checkUserExistence(input.email, userService);
    const hashedPassword: string = await bcrypt.hash(input.password, 10);
    const dbUser: Partial<DatabaseModelOf<User>> = this.mapUser({
      email: input.email,
      hashedPassword,
    });
    return await userService.create(dbUser);
  }

  private async checkUserExistence(
    email: string,
    userService: UserService<User>,
  ) {
    const user: Optional<User> = await userService.getWith({
      email: email,
    });
    if (user) {
      throw new ConflictException("User already exists.");
    }
  }
}
