import { User } from '../entities/user';

export class UserRepository {
  public async findUserById(userId: string) {
    const user = await User.query.user({ userId }).go();
    return user.data;
  }

  public async createUser(userId: string, email: string, loginType: string, createdOn: string, password?: string) {
    const user = await User.create({ userId, email, loginType, createdOn, password }).go();
    return user.data;
  }
}
