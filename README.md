# NestJS Easy Auth

Elegant and simple authentication solution for NestJS.

```typescript
@Module({
  imports: [
    AuthModule.withConfiguration({
      jwtConfig: {
        secret: 'my-secret',
        accessTokenExpiresIn: '1h',
        refreshTokenExpiresIn: '1d',
        tokenExtraction: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false
      },
      modelProvider: DefaultModelProvider.withModels({
        credentials: CredentialsMock,
        user: UserMock
      }),
      methods: [SignInEmailPassword.forRoot(), LogInEmailPassword.forRoot()]
    })
  ]
})
export class ApiModule {}
```

# Table of Contents

- [Installation](#installation)
- [Quick start](#quick-start)
  1. [Provide your database](#1-provide-your-database)
  2. [Provide your jwt configuration](#2-provide-your-jwt-configuration)
  3. [Provide your models](#3-provide-your-models)
  4. [Provide your authentication methods](#4-provide-your-authentication-methods)
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

### 1. Provide your database

This package allows you to use your own database for the credentials and user storage.
You can create your own `CredentialsStorage` and `UserStorage`.

<details>
<summary><strong>Using MongoDB</strong></summary>

You can use MongoDB as the main storage. Thi, you can install [nestjs-easy-auth-mongo](https://github.com/bpisano/nestjs-easy-auth-mongo) which provides a MongoDB implementation.
To get started, import the `AuthMongoProviderModule` in your `ApiModule`.

```bash
$ yarn
yarn add nestjs-easy-auth-mongo

$ npm
npm install nestjs-easy-auth-mongo
```

```typescript
@Module({
  imports: [
    AuthMongoProviderModule.withConfiguration({
      dbName: 'your-database-name',
      uri: 'mongodb://user:password@127.0.0.1:27017',
      schemas: {
        credentials: DBCredentialsSchema,
        user: DBUserSchema
      }
    })
  ]
})
export class ApiModule {}
```

</details>

<details>
<summary><strong>Using SQL</strong></summary>
    Comming soon...
</details>

<details>
<summary><strong>Using a custom database</strong></summary>
    See <a href="## Providing a custom storage">providing a custom storage</a>.
</details>

### 2. Provide your jwt configuration

Provide your jwt configuration using the `jwtConfig` property.

```typescript
AuthModule.withConfiguration({
  jwtConfig: {
    secret: 'my-secret',
    accessTokenExpiresIn: '1h',
    refreshTokenExpiresIn: '1d',
    tokenExtraction: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false
  }
});
```

### 3. Provide your models

This package allows you to use your own `Credentials` and `User` models.
Your models needs to conforms to the `CredentialsRepresentation` and `UserRepresentation` interfaces.

<details>
<summary><strong>Credentials model example</strong></summary>

```typescript
export class Credentials implements CredentialsRepresentation<DBCredentials, PublicCredentials> {
  public constructor(
    public readonly userId: string,
    public readonly authType: string,
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly accessTokenExpiration: Date,
    public readonly refreshTokenExpiration: Date
  ) {}

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

</details>

<details>
<summary><strong>User model example</strong></summary>

```typescript
export class User implements UserRepresentation<DBUser, PublicUser> {
  public constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly hashedPassword?: string
  ) {}

  // Required to convert the model to a database model.
  public toDatabaseModel(): DBUser {
    return new DBUser(this.id, this.email, this.hashedPassword);
  }

  // Required to convert the model to a public model.
  // Do not include the hashed password in the public model.
  public toPublicModel(): PublicUser {
    return new PublicUser(this.id, this.email);
  }
}
```

</details>

You can provide your models using the `DefaultModelProvider` class.

```typescript
AuthModule.withConfiguration({
  jwtConfig: { ... },
  modelProvider: DefaultModelProvider.withModels({
    credentials: CredentialsMock,
    user: UserMock
  })
});
```

### 4. Provide your authentication methods

You can provide your authentication methods using the `methods` property.
These methods will be used to authenticate your users.

```typescript
AuthModule.withConfiguration({
  jwtConfig: { ... },
  modelProvider: DefaultModelProvider.withModels({ ... }),
  methods: [SignInEmailPassword.forRoot(), LogInEmailPassword.forRoot()]
});
```

With theses methods, you can create and authentify users using their email and password with the following HTTP requests:

```HTTP
POST /auth/sign-in
{
  "email": "user@yourdomain.com",
  "password": "my-password"
}
```

```HTTP
POST /auth/login
{
  "email": "user@yourdomain.com",
  "password": "my-password"
}
```

You can also refresh you credentials using the `POST /auth/refresh` endpoint.

```HTTP
POST /auth/refresh
{
  "refresh_token": "your-refresh-token"
}
```

# Documentation

## Authentication methods

### SignInEmailPassword

#### Inputs

| **Property** | **Example**           |
| ------------ | --------------------- |
| email        | `user@yourdomain.com` |
| password     | `yourpassword`        |

#### Options

| **Option**   | **Default value**                |
| ------------ | -------------------------------- |
| hashPassword | `SignInEmailPassword.brcyptHash` |

### LoginEmailPassword

#### Inputs

| **Property** | **Example**           |
| ------------ | --------------------- |
| email        | `user@yourdomain.com` |
| password     | `yourpassword`        |

#### Options

| **Option**      | **Default value**                             |
| --------------- | --------------------------------------------- |
| comparePassword | `LoginEmailPassword.bcryptPasswordComparison` |
