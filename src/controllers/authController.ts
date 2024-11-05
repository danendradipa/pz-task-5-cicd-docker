// controllers/authController.ts
import { Request, Response } from 'express';
import { AuthService } from '../service/authService';
import jwt from 'jsonwebtoken';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
      const user = await this.authService.validateUser(username, password);
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  };
}
