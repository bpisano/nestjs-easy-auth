import { AnyCredentialsRepresentation } from "../../credentials/models/types/anyCredentialsRepresentation";
import { DatabaseModelOf } from "../../utils/types/databaseModelOf";

export type MapCredentials<Credentials extends AnyCredentialsRepresentation> =
  (params: {
    userId: string;
    authType: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiration: Date;
    refreshTokenExpiration: Date;
  }) => Partial<DatabaseModelOf<Credentials>>;
