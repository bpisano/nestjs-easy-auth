import { DynamicModule, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JWTConfig } from "../models/types/jwtConfig";
import { ApiJwtService } from "../services/apiJwt.service";
import { JWT_CONFIG, JWT_SERVICE } from "./jwt.moduleKeys";

@Module({})
export class JWTModule {
  public static withConfig(config: JWTConfig): DynamicModule {
    return {
      module: JWTModule,
      imports: [
        JwtModule.register({
          secret: config.secret,
          signOptions: { expiresIn: config.accessTokenExpiresIn },
        }),
      ],
      providers: [
        { provide: JWT_CONFIG, useValue: config },
        { provide: JWT_SERVICE, useClass: ApiJwtService },
      ],
      exports: [JWT_CONFIG, JWT_SERVICE],
    };
  }
}
