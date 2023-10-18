import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LogInEmailPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @IsStrongPassword({
    minLength: 8
  })
  @IsNotEmpty()
  public readonly password: string;
}
