const { checkout } = require('./checkout');
const Sale = require('../category_models/sale');
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

// Mock the models
jest.mock('../category_models/sale');
jest.mock('../category_models/category');

describe('checkout', () => {
   let mockReq;
   let mockRes;
   let mockSavedSale;

   beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => { });

      mockReq = {
         body: {
            cart: [
               { _id: '1', name: 'Product 1', quantity: 2, price: 10, category: 'Generic' },
               { _id: '2', name: 'Product 2', quantity: 1, price: 20, category: 'Branded' }
            ],
            discountType: 'none',
            total: 40,
            amountPaid: 50
         }
      };
      mockRes = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
      };

      // Mock Sale constructor and save method
      mockSavedSale = { _id: 'newSaleId' };
      Sale.mockImplementation(() => ({
         save: jest.fn().mockResolvedValue(mockSavedSale)
      }));

      // Mock findByIdAndUpdate for all category models
      const mockFindByIdAndUpdate = jest.fn().mockResolvedValue({});
      Generic.findByIdAndUpdate = mockFindByIdAndUpdate;
      Branded.findByIdAndUpdate = mockFindByIdAndUpdate;
      Syrup.findByIdAndUpdate = mockFindByIdAndUpdate;
      Syrup2.findByIdAndUpdate = mockFindByIdAndUpdate;
      Antibiotics.findByIdAndUpdate = mockFindByIdAndUpdate;
      OintmentDrops.findByIdAndUpdate = mockFindByIdAndUpdate;
      Cosmetics.findByIdAndUpdate = mockFindByIdAndUpdate;
      Diapers.findByIdAndUpdate = mockFindByIdAndUpdate;
      Others.findByIdAndUpdate = mockFindByIdAndUpdate;
   });

   afterEach(() => {
      jest.clearAllMocks();
      console.error.mockRestore();
   });

   test('should process checkout successfully', async () => {
      mockReq.body.cart[0].category = 'InvalidCategory';

      await checkout(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid category' });
   });

   test('should handle errors during checkout', async () => {
      const mockError = new Error('Test error');
      Sale.mockImplementation(() => ({
         save: jest.fn().mockRejectedValue(mockError)
      }));

      await checkout(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
         message: 'Error during checkout',
         error: 'Test error'
      });
   });

   test('should handle errors during inventory update', async () => {
      const mockError = new Error('Inventory update error');
      Generic.findByIdAndUpdate.mockRejectedValue(mockError);

      await checkout(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
         message: 'Error during checkout',
         error: 'Inventory update error'
      });
   });
});