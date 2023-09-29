import { JwtFromRequestFunction } from 'passport-jwt';

export type JWTConfig = {
  secret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  tokenExtraction: JwtFromRequestFunction;
  ignoreExpiration: boolean;
};
