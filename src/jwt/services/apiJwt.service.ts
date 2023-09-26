import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenType } from "../models/enums/tokenType";
import { JWTConfig } from "../models/types/jwtConfig";
import { JWT_CONFIG } from "../modules/jwt.moduleKeys";
import { JWTService } from "./jwt.service";

export class ApiJwtService implements JWTService {
  public constructor(
    @Inject(JWT_CONFIG) public readonly config: JWTConfig,
    private readonly jwtService: JwtService,
  ) {}

  public tokenExpirationDate(tokenType: TokenType): Date {
    const now = new Date();
    switch (tokenType) {
      case TokenType.access:
        return new Date(now.getTime() + this.config.accessTokenExpiresIn);
      case TokenType.refresh:
        return new Date(now.getTime() + this.config.refreshTokenExpiresIn);
      default:
        throw new Error("Invalid token type");
    }
  }

  public async createAccessToken(params: {
    userId: string;
    authType: string;
  }): Promise<string> {
    const payload: any = {
      sub: params.userId,
      auth_type: params.authType,
      topken_type: TokenType.access,
      iat: Date.now(),
    };
    return this.jwtService.signAsync(payload);
  }

  public async createRefreshToken(params: { userId: string }): Promise<string> {
    const payload: any = {
      sub: params.userId,
      topken_type: TokenType.refresh,
      iat: Date.now(),
    };
    return this.jwtService.signAsync(payload);
  }

  public async validateAccessToken(accessToken: string): Promise<any> {
    return this.jwtService.verifyAsync(accessToken, {
      secret: this.config.secret,
    });
  }
}
