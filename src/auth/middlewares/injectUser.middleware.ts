import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { CREDENTIALS_SERVICE } from '../../credentials/modules/credentials.moduleKeys';
import { CredentialsService } from '../../credentials/services/credentials.service';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { USER_SERVICE } from '../../user/modules/user.moduleKeys';
import { UserService } from '../../user/services/user.service';
import { Optional } from '../../utils/types/optional';
import { PromiseOptional } from '../../utils/types/promiseOptional';

@Injectable()
export class InjectUserMiddleware<Credentials extends AnyCredentialsRepresentation, User extends AnyUserRepresentation>
  implements NestMiddleware
{
  public constructor(
    @Inject(CREDENTIALS_SERVICE)
    private readonly credentialsService: CredentialsService<Credentials>,
    @Inject(USER_SERVICE) private readonly userService: UserService<User>
  ) {}

  public async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const accessToken: Optional<string> = this.getAccessTokenFromRequest(req);
    if (!accessToken) {
      next();
      return;
    }

    const user: Optional<User> = await this.getUserFromAccessToken(accessToken);
    if (!user) {
      next();
      return;
    }

    req['current_user'] = user;

    next();
  }

  private getAccessTokenFromRequest(req: Request): Optional<string> {
    const authorizationHeader: Optional<string> = req.headers.authorization;
    if (!authorizationHeader) {
      return undefined;
    }
    const [tokenType, accessToken]: string[] = authorizationHeader.split(' ');
    if (tokenType.toLowerCase() !== 'bearer') {
      return undefined;
    }
    return accessToken;
  }

  private async getUserFromAccessToken(accessToken: string): PromiseOptional<User> {
    const credentials: Optional<Credentials> = await this.credentialsService.getWithAccessToken(accessToken);
    if (!credentials) {
      return undefined;
    }
    return await this.userService.getWithId(credentials.userId);
  }
}
