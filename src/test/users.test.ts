import { Request, Response } from 'express';
import User from '@database/nosql/models/user.model';
import { sendEmail } from '@utils/mail';
import { generateTemporaryPassword } from '@utils/temporaryPassword';
import { extractUserFromToken, generateToken } from '@middleware/auth.middleware';
import { hashString, validateHash } from '@utils/cipher';
import { getUsers, login, signIn } from '@controllers/users.controllers';

jest.mock('@database/nosql/models/user.model');
jest.mock('@utils/mail');
jest.mock('@utils/temporaryPassword');
jest.mock('@middleware/auth.middleware');
jest.mock('@utils/cipher');

describe('User Controller Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockImplementation(async (result) => {
        responseObject = await result;
      }),
    };
  });

  describe('getUsers', () => {
    it('should return user data when successful', async () => {
      const mockUser = { uuid: '123', name: 'Test User' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (extractUserFromToken as jest.Mock).mockReturnValue('123');

      await getUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        status: 200,
        message: 'User data',
        data: { user: mockUser },
      });
    });

    it('should return 500 when an error occurs', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.status).toBe(500);
      expect(responseObject.message).toBe('An error was generated when trying to get User data.');
    });
  });

  describe('signIn', () => {
    it('should send a temporary code when user exists', async () => {
      const mockUser = { email: 'test@user.com', save: jest.fn() };
      mockRequest.body = { email: 'test@user.com' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (generateTemporaryPassword as jest.Mock).mockResolvedValue('123456');
      (hashString as jest.Mock).mockResolvedValue('hashedCode');

      await signIn(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        status: 200,
        message: 'Sign in successful, code sent to email',
        data: {},
      });
      expect(sendEmail).toHaveBeenCalledWith('test@user.com', 'Code verification', 'Your code is 123456');
    });

    it('should return 404 when user is not found', async () => {
      mockRequest.body = { email: 'nonexistent@user.com' };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await signIn(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toEqual({
        status: 404,
        message: 'User not found',
      });
    });
  });

  describe('login', () => {
    it('should login successfully with correct code', async () => {
      const mockUser = { 
        uuid: '123', 
        email: 'test@user.com', 
        temporaryCode: 'hashedCode',
        save: jest.fn()
      };
      mockRequest.body = { email: 'test@user.com', code: '123456' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (validateHash as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockResolvedValue('token123');

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        status: 200,
        message: 'Login successful',
        data: { 
          user: { uuid: '123', email: 'test@user.com' },
          token: 'token123'
        },
      });
    });

    it('should return 401 with incorrect code', async () => {
      const mockUser = { 
        email: 'test@user.com', 
        temporaryCode: 'hashedCode',
      };
      mockRequest.body = { email: 'test@user.com', code: 'wrongcode' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (validateHash as jest.Mock).mockResolvedValue(false);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject).toEqual({
        status: 401,
        message: 'Invalid code',
      });
    });

    it('should return 404 when user is not found', async () => {
      mockRequest.body = { email: 'nonexistent@user.com', code: '123456' };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toEqual({
        status: 404,
        message: 'User not found',
      });
    });
  });
});
                                                                                