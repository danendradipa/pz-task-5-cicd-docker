// service/authService.ts
import { User } from '../models/User';
import { IUserDocument } from '../types/user';

export class AuthService {
  async validateUser(username: string, password: string): Promise<IUserDocument | null> {
    try {
      const user = await User.findOne({ username }) as IUserDocument | null; 
      if (user && user.password === password) {
        return user; 
      }
      return null; 
    } catch (error) {
      console.error('Error validating user:', error);
      throw error; 
    }
  }
}
