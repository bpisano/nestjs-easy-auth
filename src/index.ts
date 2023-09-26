// import { Module } from "@nestjs/common";
// import {
//   ToAppModelConvertible,
//   ToDatabaseModelConvertible,
//   ToPublicModelConvertible,
// } from "model-conversion";
//
// interface Identifiable {
//   id: string;
// }
//
// type UserRepresentation<
//   DatabaseModel extends Identifiable,
//   PublicModel
// > = Identifiable &
//   ToDatabaseModelConvertible<DatabaseModel> &
//   ToPublicModelConvertible<PublicModel>;
//
// export class MyDBUser implements Identifiable, ToAppModelConvertible<MyUser> {
//   public constructor(public id: string, public name: string) {}
//
//   public toAppModel(): MyUser {
//     return new MyUser(this.id, this.name);
//   }
// }
//
// export class MyPublicUser implements Identifiable {
//   public constructor(public id: string, public name: string) {}
// }
//
// class MyUser
//   implements
//     ToDatabaseModelConvertible<MyDBUser>,
//     ToPublicModelConvertible<MyPublicUser>
// {
//   public constructor(public id: string, public name: string) {}
//
//   public toDatabaseModel(): MyDBUser {
//     return new MyDBUser(this.id, this.name);
//   }
//
//   public toPublicModel(): MyPublicUser {
//     return new MyPublicUser(this.id, this.name);
//   }
// }
//
// // Types inferance
//
// type DatabaseModel<T> = T extends ToDatabaseModelConvertible<infer U>
//   ? U
//   : never;
// type AnyUserRepresentation = UserRepresentation<any, any>;
//
// // Storage -------------------------------------------------------------------------------------------------
//
// interface UserStorage<User extends AnyUserRepresentation> {
//   getWithId(id: string): Promise<DatabaseModel<User>>;
//   create(user: Partial<DatabaseModel<User>>): Promise<DatabaseModel<User>>;
// }
//
// export class MongoUserStorage<User extends AnyUserRepresentation>
//   implements UserStorage<User>
// {
//   getWithId(_id: string): Promise<DatabaseModel<User>> {
//     throw new Error("Method not implemented.");
//   }
//   create(_user: Partial<DatabaseModel<User>>): Promise<DatabaseModel<User>> {
//     throw new Error("Method not implemented.");
//   }
// }
//
// const storage: UserStorage<MyUser> = new MongoUserStorage<MyUser>();
// const createdUser: Promise<MyDBUser> = storage.create({
//   id: "1",
//   name: "John",
// });
// console.log(createdUser);
//
// // Service -------------------------------------------------------------------------------------------------
//
// interface UserService<User extends AnyUserRepresentation> {
//   getWithId(id: string): Promise<User>;
//   create(user: Partial<DatabaseModel<User>>): Promise<User>;
// }
//
// export class AppUserService<User extends AnyUserRepresentation>
//   implements UserService<User>
// {
//   constructor(private storage: UserStorage<User>) {}
//
//   async getWithId(id: string): Promise<User> {
//     const dbUser: DatabaseModel<User> = await this.storage.getWithId(id);
//     return dbUser.toAppModel();
//   }
//
//   async create(user: Partial<DatabaseModel<User>>): Promise<User> {
//     const dbUser: DatabaseModel<User> = await this.storage.create(user);
//     return dbUser.toAppModel();
//   }
// }
//
// // Auth -------------------------------------------------------------------------------------------------
//
// interface AuthenticationMethod<Input, User extends AnyUserRepresentation> {
//   authenticate(input: Input): Promise<User>;
// }
//
// type AnyAuthenticationMethod<User extends AnyUserRepresentation> =
//   AuthenticationMethod<any, User>;
//
// export class SignInWithEmailPassword<User extends AnyUserRepresentation>
//   implements AuthenticationMethod<{ email: string; password: string }, User>
// {
//   constructor(private userService: UserService<User>) {}
//
//   async authenticate(input: {
//     email: string;
//     password: string;
//   }): Promise<User> {
//     const user = await this.userService.getWithId(input.email);
//     return user;
//   }
// }
//
// // Usage -------------------------------------------------------------------------------------------------
//
// export function createModule<User extends AnyUserRepresentation>(params: {
//   storage: UserStorage<User>;
//   authenticationMethods: AnyAuthenticationMethod<User>[];
// }): void {
//   console.log(params.storage);
// }
//
// createModule({
//   storage: new MongoUserStorage<MyUser>(),
//   authenticationMethods: [
//     new SignInWithEmailPassword<MyUser>(
//       new AppUserService<MyUser>(new MongoUserStorage<MyUser>())
//     ),
//   ],
// });
//
// @Module({})
// export class UserModule {}
//
//
//
//

import { Controller, Post } from "@nestjs/common";

interface Auth {
  path: string;
}

function createController<T extends Auth>(params: { auth: T }) {
  const path = params.auth.path;
  @Controller("auth")
  class AuthController {
    @Post(path)
    async performAuth() {
      console.log(path);
    }
  }
  return AuthController;
}

export const AuthController = createController({ auth: { path: "email" } });
