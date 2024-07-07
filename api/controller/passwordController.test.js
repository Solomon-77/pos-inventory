const argon2 = require("argon2");
const nodemailer = require("nodemailer");
const { requestPasswordReset, verifyCode, resetPassword } = require('./passwordController');
const User = require('../model/User');
const PasswordReset = require('../model/PasswordReset');

jest.mock("argon2");
jest.mock("nodemailer");
jest.mock("../model/User");
jest.mock("../model/PasswordReset");

describe('passwordController', () => {
   let mockRequest;
   let mockResponse;
   let mockSendMail;

   beforeEach(() => {
      mockRequest = {
         body: {},
      };
      mockResponse = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn(),
      };
      mockSendMail = jest.fn().mockResolvedValue(true);
      nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });
   });

   describe('requestPasswordReset', () => {
      it('should return 400 if email is not found', async () => {
         mockRequest.body = { email: 'nonexistent@email.com' };
         User.exists.mockResolvedValue(false);

         await requestPasswordReset(mockRequest, mockResponse);

         expect(mockResponse.status).toHaveBeenCalledWith(400);
         expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email not found' });
      });
   });

   describe('verifyCode', () => {
      it('should return 400 if reset token is invalid or expired', async () => {
         mockRequest.body = { email: 'valid@email.com', code: '123456' };
         PasswordReset.findOne.mockResolvedValue(null);

         await verifyCode(mockRequest, mockResponse);

         expect(mockResponse.status).toHaveBeenCalledWith(400);
         expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid or expired reset code' });
      });

      it('should return 200 if reset code is valid', async () => {
         mockRequest.body = { email: 'valid@email.com', code: '123456' };
         PasswordReset.findOne.mockResolvedValue({ expiresAt: Date.now() + 1000 });

         await verifyCode(mockRequest, mockResponse);

         expect(mockResponse.status).toHaveBeenCalledWith(200);
         expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Reset code is valid' });
      });
   });

   describe('resetPassword', () => {
      it('should return 400 if password is invalid', async () => {
         mockRequest.body = { email: 'valid@email.com', code: '123456', newPassword: 'weak' };

         await resetPassword(mockRequest, mockResponse);

         expect(mockResponse.status).toHaveBeenCalledWith(400);
         expect(mockResponse.json).toHaveBeenCalledWith({ error: expect.stringContaining('Password must') });
      });

      it('should return 400 if reset token is invalid or expired', async () => {
         mockRequest.body = { email: 'valid@email.com', code: '123456', newPassword: 'StrongPass1!' };
         PasswordReset.findOne.mockResolvedValue(null);

         await resetPassword(mockRequest, mockResponse);

         expect(mockResponse.status).toHaveBeenCalledWith(400);
         expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid or expired reset code' });
      });

      it('should reset password successfully', async () => {
         mockRequest.body = { email: 'valid@email.com', code: '123456', newPassword: 'StrongPass1!' };
         PasswordReset.findOne.mockResolvedValue({ expiresAt: Date.now() + 1000 });
         argon2.hash.mockResolvedValue('hashedpassword');
         User.updateOne.mockResolvedValue(true);
         PasswordReset.deleteOne.mockResolvedValue(true);

         await resetPassword(mockRequest, mockResponse);

         expect(argon2.hash).toHaveBeenCalledWith('StrongPass1!');
         expect(User.updateOne).toHaveBeenCalledWith({ email: 'valid@email.com' }, { password: 'hashedpassword' });
         expect(PasswordReset.deleteOne).toHaveBeenCalledWith({ email: 'valid@email.com', code: '123456' });
         expect(mockResponse.status).toHaveBeenCalledWith(200);
         expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Password reset successfully' });
      });
   });
});