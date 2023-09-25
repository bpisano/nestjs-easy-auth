import { AuthenticationFeature } from "../../authenticationMethods/authenticationFeature.service";
import { StaticImplements } from "./staticImplements";

export function AuthFeature() {
  return StaticImplements<AuthenticationFeature>();
}
