import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { AuthService } from '../service/authService';
import { User } from '../models/User';
import { IUserDocument } from '../types/user';

let mongoServer: MongoMemoryServer;
let authService: AuthService;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await User.deleteMany({});
  authService = new AuthService();
});

describe('AuthService', () => {
  const mockUser: Partial<IUserDocument> = {
    username: 'testuser',
    password: 'testpass'
  };

  describe('validateUser', () => {
    it('must return user when username and password match', async () => {
      await User.create(mockUser);
      const result = await authService.validateUser('testuser', 'testpass');
      expect(result).toBeDefined();
      expect(result?.username).toBe(mockUser.username);
    });

    it('must return null when username exists but password does not match', async () => {
      await User.create({ ...mockUser, password: 'wrongpass' });
      const result = await authService.validateUser('testuser', 'testpass');

      expect(result).toBeNull();
    });

    it('must return null when username does not exist', async () => {
      const result = await authService.validateUser('nonexistentuser', 'testpass');

      expect(result).toBeNull();
    });
  });
});
