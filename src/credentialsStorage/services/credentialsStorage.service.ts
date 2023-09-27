import { AnyCredentialsRepresentation } from "../../credentials/models/types/anyCredentialsRepresentation";
import { DatabaseModelOf } from "../../utils/types/databaseModelOf";
import { PromiseOptional } from "../../utils/types/promiseOptional";

export interface CredentialsStorage<
  Credentials extends AnyCredentialsRepresentation,
> {
  getOneWith(params: any): PromiseOptional<DatabaseModelOf<Credentials>>;
  getManyWith(params: any): Promise<DatabaseModelOf<Credentials>[]>;
  create(
    credentials: Partial<DatabaseModelOf<Credentials>>,
  ): Promise<DatabaseModelOf<Credentials>>;
  deleteOneWith(params: any): Promise<void>;
}
