import { Provider } from "@nestjs/common";
import { Type } from "@nestjs/common/interfaces";
import { AnyCredentialsRepresentation } from "../../../credentials/models/types/anyCredentialsRepresentation";
import { AnyUserRepresentation } from "../../../user/models/types/anyUserRepresentation";
import { AuthenticationFeature } from "../../authenticationFeature.service";
import { SignInWithEmailAndPasswordController } from "../controller/signInWithEmailAndPassword.controller";
import { SignInWithEmailAndPasswordMapper } from "../mappers/signInWithEmailAndPassword.mapper";
import { SignInWithEmailAndPasswordAuthenticator } from "../services/signInWithEmailAndPassword.authenticator";
import {
  SIGN_IN_WITH_EMAIL_AND_PASSWORD_AUTHENTICATOR,
  SIGN_IN_WITH_EMAIL_AND_PASSWORD_MAPPER,
} from "./signInWithEmailAndPassword.moduleKeys";

export class SignInWithEmailAndPassword<
  Credentials extends AnyCredentialsRepresentation,
  User extends AnyUserRepresentation
> implements AuthenticationFeature
{
  public constructor(
    private readonly mapper: SignInWithEmailAndPasswordMapper<Credentials, User>
  ) {}

  public makeProviders(): Provider[] {
    return [
      {
        provide: SIGN_IN_WITH_EMAIL_AND_PASSWORD_AUTHENTICATOR,
        useClass: SignInWithEmailAndPasswordAuthenticator,
      },
      {
        provide: SIGN_IN_WITH_EMAIL_AND_PASSWORD_MAPPER,
        useValue: this.mapper,
      },
    ];
  }

  public makeControllers(): Type<any>[] {
    return [SignInWithEmailAndPasswordController];
  }
}
