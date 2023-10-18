import { Global, Module } from '@nestjs/common';
import { CREDENTIALS_STORAGE } from '../../../credentialsStorage/modules/credentialsStorage.moduleKeys';
import { USER_STORAGE } from '../../../userStorage/modules/userStorage.moduleKeys';
import { TestCredentialsStorage } from '../../credentialsStorage/services/testCredentialsStorage.service';
import { TestUserStorage } from '../../userStorage/services/testUserStorage.service';

@Global()
@Module({
  providers: [
    { provide: CREDENTIALS_STORAGE, useClass: TestCredentialsStorage },
    { provide: USER_STORAGE, useClass: TestUserStorage }
  ],
  exports: [CREDENTIALS_STORAGE, USER_STORAGE]
})
export class AuthTestDatabaseProviderModule {}
