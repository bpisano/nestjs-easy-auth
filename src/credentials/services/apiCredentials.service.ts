import { Inject } from "@nestjs/common";
import { CREDENTIALS_STORAGE } from "../../credentialsStorage/modules/credentialsStorage.moduleKeys";
import { CredentialsStorage } from "../../credentialsStorage/services/credentialsStorage.service";
import { TokenType } from "../../jwt/models/enums/tokenType";
import { JWT_SERVICE } from "../../jwt/modules/jwt.moduleKeys";
import { JWTService } from "../../jwt/services/jwt.service";
import { DatabaseModelOf } from "../../utils/types/databaseModelOf";
import { Optional } from "../../utils/types/optional";
import { PromiseOptional } from "../../utils/types/promiseOptional";
import { AnyCredentialsRepresentation } from "../models/types/anyCredentialsRepresentation";
import { CredentialsService } from "./credentials.service";

export class ApiCredentialsService<
  Credentials extends AnyCredentialsRepresentation,
> implements CredentialsService<Credentials>
{
  public constructor(
    @Inject(CREDENTIALS_STORAGE)
    private readonly storage: CredentialsStorage<Credentials>,
    @Inject(JWT_SERVICE) private readonly jwtService: JWTService,
  ) {}

  public async getWithAccessToken(
    accessToken: string,
  ): PromiseOptional<Credentials> {
    const dbCredentials: Optional<DatabaseModelOf<Credentials>> =
      await this.storage.getWithAccessToken(accessToken);
    return dbCredentials?.toAppModel();
  }

  public async getWithUserId(userId: string): PromiseOptional<Credentials> {
    const dbCredentials: Optional<DatabaseModelOf<Credentials>> =
      await this.storage.getWithUserId(userId);
    return dbCredentials?.toAppModel();
  }

  public async create(
    params: { userId: string; authType: string },
    mapCredentials: (params: {
      userId: string;
      authType: string;
      accessToken: string;
      refreshToken: string;
      accessTokenExpiration: Date;
      refreshTokenExpiration: Date;
    }) => Partial<DatabaseModelOf<Credentials>>,
  ): Promise<Credentials> {
    const accessToken: string = await this.jwtService.createAccessToken({
      userId: params.userId,
      authType: params.authType,
    });
    const refreshToken: string = await this.jwtService.createRefreshToken({
      userId: params.userId,
    });
    const accessTokenExpiration: Date = this.jwtService.tokenExpirationDate(
      TokenType.access,
    );
    const refreshTokenExpiration: Date = this.jwtService.tokenExpirationDate(
      TokenType.refresh,
    );
    const dbCredentials: DatabaseModelOf<Credentials> =
      await this.storage.create(
        mapCredentials({
          userId: params.userId,
          authType: params.authType,
          accessToken,
          refreshToken,
          accessTokenExpiration,
          refreshTokenExpiration,
        }),
      );
    return dbCredentials.toApiModel();
  }
}
