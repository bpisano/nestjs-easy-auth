import { Inject } from '@nestjs/common';
import { MapCredentials } from '../../auth/types/mapCredentials';
import { CREDENTIALS_STORAGE } from '../../credentialsStorage/modules/credentialsStorage.moduleKeys';
import { CredentialsStorage } from '../../credentialsStorage/services/credentialsStorage.service';
import { TokenType } from '../../jwt/models/enums/tokenType';
import { JWT_SERVICE } from '../../jwt/modules/jwt.moduleKeys';
import { JWTService } from '../../jwt/services/jwt.service';
import { DatabaseModelOf } from '../../utils/types/databaseModelOf';
import { Optional } from '../../utils/types/optional';
import { PromiseOptional } from '../../utils/types/promiseOptional';
import { AnyCredentialsRepresentation } from '../models/types/anyCredentialsRepresentation';
import { CredentialsService } from './credentials.service';

export class ApiCredentialsService<Credentials extends AnyCredentialsRepresentation>
  implements CredentialsService<Credentials>
{
  public constructor(
    @Inject(CREDENTIALS_STORAGE)
    private readonly storage: CredentialsStorage<Credentials>,
    @Inject(JWT_SERVICE) private readonly jwtService: JWTService
  ) {}

  public async getWithAccessToken(accessToken: string): PromiseOptional<Credentials> {
    return await this.getOneWith({ accessToken });
  }

  public async getWithRefreshToken(refreshToken: string): PromiseOptional<Credentials> {
    return await this.getOneWith({ refreshToken });
  }

  public async getWithUserId(userId: string): Promise<Credentials[]> {
    return await this.getManyWith({ userId });
  }

  public async getOneWith(params: any): PromiseOptional<Credentials> {
    const dbCredentials: Optional<DatabaseModelOf<Credentials>> = await this.storage.getOneWith(params);
    return dbCredentials?.toAppModel();
  }

  public async getManyWith(params: any): Promise<Credentials[]> {
    const dbCredentials: DatabaseModelOf<Credentials>[] = await this.storage.getManyWith(params);
    return dbCredentials.map((dbCredentials) => dbCredentials.toAppModel());
  }

  public async create(
    params: { userId: string; authType: string },
    mapCredentials: MapCredentials<Credentials>
  ): Promise<Credentials> {
    const [accessToken, refreshToken]: string[] = await Promise.all([
      this.jwtService.createAccessToken({
        userId: params.userId,
        authType: params.authType
      }),
      this.jwtService.createRefreshToken({
        userId: params.userId
      })
    ]);
    const accessTokenExpiration: Date = this.jwtService.tokenExpirationDate(TokenType.access);
    const refreshTokenExpiration: Date = this.jwtService.tokenExpirationDate(TokenType.refresh);
    const dbCredentials: DatabaseModelOf<Credentials> = await this.storage.create(
      mapCredentials({
        userId: params.userId,
        authType: params.authType,
        accessToken,
        refreshToken,
        accessTokenExpiration,
        refreshTokenExpiration
      })
    );
    return dbCredentials.toAppModel();
  }

  public async deleteWithAccessToken(accessToken: string): Promise<void> {
    await this.storage.deleteOneWith({ accessToken });
  }
}
