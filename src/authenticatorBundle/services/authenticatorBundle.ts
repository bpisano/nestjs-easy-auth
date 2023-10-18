import { Type } from '@nestjs/common';
import { Authenticator } from '../../authenticator/services/authenticator';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { BundleController } from '../types/bundleController';
import { BundleImports } from '../types/bundleImports';
import { BundleProviders } from '../types/bundleProviders';

export interface AuthenticatorBundle<Input, User extends AnyUserRepresentation> {
  authenticator: Type<Authenticator<Input, User>>;
  controller: BundleController;
  providers?: BundleProviders;
  imports?: BundleImports;
}
