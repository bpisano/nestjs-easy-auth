import { AnyCredentialsRepresentation } from "../../credentials/models/types/anyCredentialsRepresentation";
import { DatabaseModelOf } from "../../utils/types/databaseModelOf";
import { PromiseOptional } from "../../utils/types/promiseOptional";

export interface CredentialsStorage<
  Credentials extends AnyCredentialsRepresentation
> {
  getWithAccessToken(
    accessToken: string
  ): PromiseOptional<DatabaseModelOf<Credentials>>;
  getWithUserId(userId: string): PromiseOptional<DatabaseModelOf<Credentials>>;
  create(
    credentials: Partial<DatabaseModelOf<Credentials>>
  ): Promise<DatabaseModelOf<Credentials>>;
}
