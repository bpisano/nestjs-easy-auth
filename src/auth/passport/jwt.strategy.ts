import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { JWTConfig } from "../../jwt/models/types/jwtConfig";
import { JWT_CONFIG } from "../../jwt/modules/jwt.moduleKeys";
import { AnyUserRepresentation } from "../../user/models/types/anyUserRepresentation";
import { USER_SERVICE } from "../../user/modules/user.moduleKeys";
import { UserService } from "../../user/services/user.service";
import { Optional } from "../../utils/types/optional";

@Injectable()
export class JwtStrategy<
  User extends AnyUserRepresentation,
> extends PassportStrategy(Strategy) {
  public constructor(
    @Inject(JWT_CONFIG) jwtConfig: JWTConfig,
    @Inject(USER_SERVICE) private readonly userService: UserService<User>,
  ) {
    super({
      jwtFromRequest: jwtConfig.tokenExtraction,
      ignoreExpiration: jwtConfig.ignoreExpiration,
      secretOrKey: jwtConfig.secret,
    });
  }

  public async validate(payload: any): Promise<User> {
    const user: Optional<User> = await this.userService.getWithId(payload.sub);
    if (!user) {
      throw new UnauthorizedException(`User with id ${payload.sub} not found.`);
    }
    return user;
  }
}
