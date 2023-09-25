import { TokenType } from "../models/enums/tokenType";

export interface JWTService {
  tokenExpirationDate(tokenType: TokenType): Date;
  createAccessToken(params: {
    userId: string;
    authType: string;
  }): Promise<string>;
  createRefreshToken(params: { userId: string }): Promise<string>;
  validateAccessToken(accessToken: string): Promise<any>;
}
