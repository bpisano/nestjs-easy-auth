# NestJS Easy Auth

A package to easily add authentication to your NestJS application.

# Table of Contents

- [Installation](#installation)
- [Quick start](#quick-start)
    - [Creating your models](#creating-your-models)
    - [Providing your database](#providing-your-database)
    - [Adding authentication methods](#adding-authentication-methods)
- [Documentation](#documentation)
    - [Introduction](#introduction)
    - [Authentication methods](#authentication-methods)
        - [Sign in with email and password](#sign-in-with-email-and-password)
        - [Login with email and password](#login-with-email-and-password)
    - [Creating your own authentication method](#creating-your-own-authentication-method)

# Installation

You can install the package using the following commands:

```bash
$ yarn
yarn add nestjs-easy-auth

$ npm
npm install nestjs-easy-auth
```

# Quick start

## Creating your models

You need to provide 2 models in order for this package to work:
- `Credentials`
- `User`

Both models needs to be converted to a **database model** and a **public model**. The database model is used to represent the user inside the database. The public model is used to represent the user to the outside world. Because the public model can be exposed to clients, it is recommended to not include any sensitive information in the public model.

### Credentials

The `Credentials` model represents the credentials of the user. It is used to authenticate the user. The `Credentials` model needs to implement the `CredentialsRepresentation` interface.

```ts
export class Credentials implements CredentialsRepresentation<DBCredentials, PublicCredentials> {
  public constructor(
    public readonly userId: string,
    public readonly authType: string,
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly accessTokenExpiration: Date,
    public readonly refreshTokenExpiration: Date
  ) {}

  public static fromMapCredentials(params: MapCredentialsParams): Partial<DBCredentials> {
    return new DBCredentials(
      params.userId,
      params.authType,
      params.accessToken,
      params.refreshToken,
      params.accessTokenExpiration,
      params.refreshTokenExpiration
    );
  }

  // Required to convert the model to a database model.
  public toDatabaseModel(): DBCredentials {
    return new DBCredentials(
      this.userId,
      this.authType,
      this.accessToken,
      this.refreshToken,
      this.accessTokenExpiration,
      this.refreshTokenExpiration
    );
  }

  // Required to convert the model to a public model.
  public toPublicModel(): PublicCredentials {
    return new PublicCredentials(
      this.userId,
      this.authType,
      this.accessToken,
      this.refreshToken,
      this.accessTokenExpiration,
      this.refreshTokenExpiration
    );
  }
}
```
