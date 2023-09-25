import { Body, Controller, Post } from "@nestjs/common";
import { SignInWithEmailAndPasswordDto } from "../models/dto/signInWithEmailAndPassword.dto";

@Controller("/auth")
export class SignInWithEmailAndPasswordController {
  @Post("/signin")
  public async signInWithEmailAndPassword(
    @Body() input: SignInWithEmailAndPasswordDto
  ) {
    console.log("CONTROLLER");
    console.log(input);
  }
}
