import { Inject } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { CREDENTIALS_STORAGE } from '../../credentialsStorage/modules/credentialsStorage.moduleKeys';
import { CredentialsStorage } from '../../credentialsStorage/services/credentialsStorage.service';
import { TokenType } from '../../jwt/models/enums/tokenType';
import { JWT_SERVICE } from '../../jwt/modules/jwt.moduleKeys';
import { JWTService } from '../../jwt/services/jwt.service';
import { DatabaseModelOf } from '../../utils/types/databaseModelOf';
import { Optional } from '../../utils/types/optional';
import { PromiseOptional } from '../../utils/types/promiseOptional';
import { AnyCredentialsRepresentation } from '../models/types/anyCredentialsRepresentation';
import { CREDENTIALS_MODEL } from '../modules/credentials.moduleKeys';
import { CredentialsService } from './credentials.service';

export class ApiCredentialsService<Credentials extends AnyCredentialsRepresentation>
  implements CredentialsService<Credentials>
{
  public constructor(
    @Inject(CREDENTIALS_MODEL) private readonly credentialsModel: ClassConstructor<Credentials>,
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

  public async create(params: { userId: string; authType: string }): Promise<Credentials> {
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
    const credentials: Credentials = plainToInstance(this.credentialsModel, {
      userId: params.userId,
      authType: params.authType,
      accessToken,
      refreshToken,
      accessTokenExpiration,
      refreshTokenExpiration
    });
    const createdCredentials: DatabaseModelOf<Credentials> = await this.storage.create(credentials.toDatabaseModel());
    return createdCredentials.toAppModel();
  }

  public async deleteWithAccessToken(accessToken: string): Promise<void> {
    await this.storage.deleteOneWith({ accessToken });
  }
}
