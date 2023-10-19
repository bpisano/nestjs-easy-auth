import { DynamicModule, Global, Module } from '@nestjs/common';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { ModelProvider } from '../services/modelProvider';
import { MODEL_PROVIDER } from './modelProvider.moduleKeys';

@Global()
@Module({})
export class ModelProviderModule {
  public static withProvider<Credentials extends AnyCredentialsRepresentation, User extends AnyUserRepresentation>(
    provider: ModelProvider<Credentials, User>
  ): DynamicModule {
    return {
      module: ModelProviderModule,
      providers: [{ provide: MODEL_PROVIDER, useValue: provider }],
      exports: [MODEL_PROVIDER]
    };
  }
}
