import { DatabaseModelOf } from "../../utils/types/databaseModelOf";
import { PromiseOptional } from "../../utils/types/promiseOptional";
import { AnyCredentialsRepresentation } from "../models/types/anyCredentialsRepresentation";

export interface CredentialsService<
  Credentials extends AnyCredentialsRepresentation,
> {
  getWithAccessToken(accessToken: string): PromiseOptional<Credentials>;
  getWithUserId(userId: string): PromiseOptional<Credentials>;
  create(
    params: { userId: string; authType: string },
    mapCredentials: (params: {
      userId: string;
      authType: string;
      accessToken: string;
      refreshToken: string;
      accessTokenExpiration: Date;
      refreshTokenExpiration: Date;
    }) => Partial<DatabaseModelOf<Credentials>>,
  ): Promise<Credentials>;
}
