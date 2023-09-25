import { IsString, MinLength } from "class-validator";

export class SignInWithEmailAndPasswordDto {
  @IsString()
  @MinLength(3)
  public readonly email: string;

  @IsString()
  @MinLength(8, {
    message: "Password must be at least 8 characters long",
  })
  public readonly password: string;
}
