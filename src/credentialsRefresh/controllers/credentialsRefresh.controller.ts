import { Body, Controller, Inject, Post, UnauthorizedException } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { CREDENTIALS_SERVICE } from '../../credentials/modules/credentials.moduleKeys';
import { CredentialsService } from '../../credentials/services/credentials.service';
import { Session } from '../../session/models/api/session';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { USER_SERVICE } from '../../user/modules/user.moduleKeys';
import { UserService } from '../../user/services/user.service';
import { Optional } from '../../utils/types/optional';
import { CredentialsRefreshDto } from '../models/dto/credentialsRefresh.dto';

@Controller('auth')
export class CredentialsRefreshController<
  Credentials extends AnyCredentialsRepresentation,
  User extends AnyUserRepresentation
> {
  public constructor(
    @Inject(CREDENTIALS_SERVICE)
    private readonly credentialsService: CredentialsService<Credentials>,
    @Inject(USER_SERVICE) private readonly userService: UserService<User>
  ) {}

  @Public()
  @Post('refresh')
  public async refreshCredentials(@Body() dto: CredentialsRefreshDto): Promise<Session<Credentials, User>> {
    const epxiredCredentials: Credentials = await this.getExpiredCredentials(dto.refresh_token);
    const user: Optional<User> = await this.userService.getWithId(epxiredCredentials.userId);
    if (!user) {
      throw new UnauthorizedException(`User with id ${epxiredCredentials.userId} not found.`);
    }
    const newCredentials: Credentials = await this.credentialsService.create({
      userId: user.id,
      authType: epxiredCredentials.authType
    });
    await this.credentialsService.deleteWithAccessToken(epxiredCredentials.accessToken);
    return new Session(newCredentials, user);
  }

  private async getExpiredCredentials(refreshToken: string): Promise<Credentials> {
    const epxiredCredentials: Optional<Credentials> = await this.credentialsService.getWithRefreshToken(refreshToken);
    if (!epxiredCredentials) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    return epxiredCredentials;
  }
}
