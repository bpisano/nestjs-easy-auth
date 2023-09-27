import { MongoConfig } from "../../mongoConfig/models/types/mongoConfig";
import { DBCredentialsSchemaMock } from "../credentials/models/db/dbCredentials.mock";
import { DBUserSchemaMock } from "../user/models/db/dbUser.mock";

export const mongoConfigMock: MongoConfig = {
  dbName: "user-kit",
  uri: "mongodb://root:rootpassword@127.0.0.1:27017?authMechanism=DEFAULT",
  userSchema: DBUserSchemaMock,
  credentialsSchema: DBCredentialsSchemaMock,
};
