import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { parseDayString } from "../../utils/date/parseDayString";
import { Optional } from "../../utils/types/optional";
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
    switch (tokenType) {
      case TokenType.access:
        const accessTokenExpirationDate: Optional<Date> = parseDayString(
          this.config.accessTokenExpiresIn,
        );
        if (!accessTokenExpirationDate) {
          throw new Error(
            `${this.config.accessTokenExpiresIn} is not a valid access tokeb date string.`,
          );
        }
        return accessTokenExpirationDate;
      case TokenType.refresh:
        const refreshTokenExpirationDate: Optional<Date> = parseDayString(
          this.config.refreshTokenExpiresIn,
        );
        if (!refreshTokenExpirationDate) {
          throw new Error(
            `${this.config.refreshTokenExpiresIn} is not a valid refresh tokeb date string.`,
          );
        }
        return refreshTokenExpirationDate;
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
