const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { register, verifyEmail, login } = require("./authController");
const User = require("../model/User");
const VerificationCode = require("../model/VerificationCode");

jest.mock("argon2");
jest.mock("jsonwebtoken");
jest.mock("nodemailer");
jest.mock("../model/User");
jest.mock("../model/VerificationCode");

describe("authController", () => {
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

  describe("register", () => {
    it("should return 400 if email is invalid", async () => {
      mockRequest.body = { email: "invalidemail" };
      await register(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid email format" });
    });

    it("should return 400 if password is invalid", async () => {
      mockRequest.body = { email: "valid@email.com", password: "weak" };
      await register(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: expect.stringContaining("Password must") });
    });

    it("should return 400 if email is already taken", async () => {
      mockRequest.body = { email: "taken@email.com", password: "StrongPass1!" };
      User.exists.mockResolvedValue(true);
      await register(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Email already taken" });
    });
  });

  describe("verifyEmail", () => {
    it("should return 400 if email is invalid", async () => {
      mockRequest.body = { email: "invalidemail" };
      await verifyEmail(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid email format" });
    });

    it("should return 400 if verification code is invalid", async () => {
      mockRequest.body = { email: "valid@email.com", code: "123456" };
      VerificationCode.findOne.mockResolvedValue(null);
      await verifyEmail(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid or expired verification code" });
    });
  });

  describe("login", () => {
    it("should return 401 if user is not found", async () => {
      mockRequest.body = { email: "nonexistent@email.com", password: "password" };
      User.findOne.mockResolvedValue(null);
      await login(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });

    it("should return 401 if password is incorrect", async () => {
      mockRequest.body = { email: "valid@email.com", password: "wrongpassword" };
      User.findOne.mockResolvedValue({ password: "hashedpassword" });
      argon2.verify.mockResolvedValue(false);
      await login(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });

    it("should return JWT token on successful login", async () => {
      mockRequest.body = { email: "valid@email.com", password: "correctpassword" };
      User.findOne.mockResolvedValue({ _id: "userid", username: "user", email: "valid@email.com", role: "user" });
      argon2.verify.mockResolvedValue(true);
      jwt.sign.mockReturnValue("jwttoken");

      await login(mockRequest, mockResponse);

      expect(jwt.sign).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: "jwttoken" });
    });
  });
});