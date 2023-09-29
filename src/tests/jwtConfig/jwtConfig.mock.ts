import { ExtractJwt } from 'passport-jwt';
import { JWTConfig } from '../../jwt/models/types/jwtConfig';

export const jwtConfigMock: JWTConfig = {
  secret: 'secret',
  accessTokenExpiresIn: '1h',
  refreshTokenExpiresIn: '1d',
  tokenExtraction: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false
};
