import { PromiseOptional } from "../../utils/types/promiseOptional";
import { AnyCredentialsRepresentation } from "../models/types/anyCredentialsRepresentation";

export interface CredentialsService<
  Credentials extends AnyCredentialsRepresentation
> {
  getWithAccessToken(accessToken: string): PromiseOptional<Credentials>;
  getWithUserId(userId: string): PromiseOptional<Credentials>;
  create(params: { userId: string; authType: string }): Promise<Credentials>;
}
