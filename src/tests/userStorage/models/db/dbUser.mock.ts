import { ToAppModelConvertible } from 'model-conversion';
import { UserMock } from '../app/user.mock';

export class DBUserMock implements ToAppModelConvertible<UserMock> {
  public constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly hashedPassword?: string
  ) {}

  public toAppModel(): UserMock {
    return new UserMock(this.id, this.email, this.hashedPassword);
  }
}
