import { PromiseOptional } from '../../utils/types/promiseOptional';
import { AnyCredentialsRepresentation } from '../models/types/anyCredentialsRepresentation';

export interface CredentialsService<Credentials extends AnyCredentialsRepresentation> {
  getWithAccessToken(accessToken: string): PromiseOptional<Credentials>;
  getWithRefreshToken(refreshToken: string): PromiseOptional<Credentials>;
  getWithUserId(userId: string): Promise<Credentials[]>;
  getOneWith(params: any): PromiseOptional<Credentials>;
  getManyWith(params: any): Promise<Credentials[]>;
  create(params: { userId: string; authType: string }): Promise<Credentials>;
  deleteWithAccessToken(accessToken: string): Promise<void>;
}
