import { Provider } from "@nestjs/common";
import { Type } from "@nestjs/common/interfaces";

export interface AuthenticationFeature {
  makeProviders(): Provider[];
  makeControllers(): Type<any>[];
}
