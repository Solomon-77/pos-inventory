const { updateProduct } = require('./updateProduct');
const {
   Generic,
   Branded,
   Syrup,
   Syrup2,
   Antibiotics,
   OintmentDrops,
   Cosmetics,
   Diapers,
   Others
} = require('../category_models/category');
const UserLog = require('../model/UserLog');

jest.mock('../category_models/category');
jest.mock('../model/UserLog');

describe('updateProduct', () => {
   let mockRequest;
   let mockResponse;

   beforeEach(() => {
      mockRequest = {
         body: {},
         user: { username: 'testuser' }
      };
      mockResponse = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
      };
   });

   it('should return 400 if category is invalid', async () => {
      mockRequest.body = { category: 'invalidCategory' };

      await updateProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid category' });
   });

   it('should return 404 if product is not found', async () => {
      mockRequest.body = { category: 'generic', currentName: 'NonexistentProduct' };
      Generic.findOne = jest.fn().mockResolvedValue(null);

      await updateProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Product not found' });
   });

   it('should update product successfully', async () => {
      const initialProduct = {
         name: 'Initial Product',
         quantity: 10,
         price: 9.99,
         criticalLevel: 5,
         save: jest.fn().mockResolvedValue(true)
      };
      mockRequest.body = {
         category: 'generic',
         currentName: 'Initial Product',
         newName: 'Updated Product',
         quantity: 15,
         price: 14.99,
         criticalLevel: 7
      };
      Generic.findOne = jest.fn().mockResolvedValue(initialProduct);

      await updateProduct(mockRequest, mockResponse);

      expect(initialProduct.save).toHaveBeenCalled();
      expect(UserLog.create).toHaveBeenCalledWith({
         user: 'testuser',
         action: 'Updated Product',
         details: expect.stringContaining('Updated Initial Product in generic category')
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
         name: 'Updated Product',
         quantity: 15,
         price: 14.99,
         criticalLevel: 7
      }));
   });

   it('should handle errors', async () => {
      mockRequest.body = { category: 'generic', currentName: 'Test Product' };
      Generic.findOne = jest.fn().mockRejectedValue(new Error('Test error'));

      await updateProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
   });
});