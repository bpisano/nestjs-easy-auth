import { ToDatabaseModelConvertible, ToPublicModelConvertible } from 'model-conversion';

export type CredentialsRepresentation<DatabaseModel, PublicModel> = {
  userId: string;
  authType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: Date;
  refreshTokenExpiration: Date;
} & ToDatabaseModelConvertible<DatabaseModel> &
  ToPublicModelConvertible<PublicModel>;
