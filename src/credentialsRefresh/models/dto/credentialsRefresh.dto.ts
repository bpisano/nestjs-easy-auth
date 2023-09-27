import { IsString, MinLength } from "class-validator";

export class CredentialsRefreshDto {
  @IsString()
  @MinLength(5)
  public readonly refresh_token: string;
}
