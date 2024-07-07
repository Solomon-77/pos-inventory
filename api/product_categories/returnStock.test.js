const { returnStock } = require('./returnStock');
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
const { recalculateRevenue } = require('./updateSaleStatus');

jest.mock('../category_models/sale');
jest.mock('../category_models/category');
jest.mock('./updateSaleStatus');

describe('returnStock', () => {
   let mockRequest;
   let mockResponse;

   beforeEach(() => {
      mockRequest = {
         params: { id: 'sale1' }
      };
      mockResponse = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
      };
   });

   it('should return 404 if sale is not found', async () => {
      Sale.findById = jest.fn().mockResolvedValue(null);

      await returnStock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Sale not found' });
   });

   it('should return 400 if sale is not voided', async () => {
      Sale.findById = jest.fn().mockResolvedValue({ status: 'successful' });

      await returnStock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Only voided sales can be returned' });
   });

   it('should return 400 if stock has already been returned', async () => {
      Sale.findById = jest.fn().mockResolvedValue({ status: 'voided', returnedToInventory: true });

      await returnStock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Stock has already been returned' });
   });

   it('should process stock return successfully', async () => {
      const mockSale = {
         status: 'voided',
         returnedToInventory: false,
         items: [
            { productId: '1', quantity: 2, category: 'generic' },
            { productId: '2', quantity: 1, category: 'branded' }
         ],
         save: jest.fn().mockResolvedValue(true)
      };
      Sale.findById = jest.fn().mockResolvedValue(mockSale);

      Generic.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      Branded.findByIdAndUpdate = jest.fn().mockResolvedValue({});

      recalculateRevenue.mockResolvedValue({ dailyRevenue: 100, weeklyRevenue: 500, monthlyRevenue: 2000 });

      await returnStock(mockRequest, mockResponse);

      expect(Generic.findByIdAndUpdate).toHaveBeenCalledWith('1', { $inc: { quantity: 2 } });
      expect(Branded.findByIdAndUpdate).toHaveBeenCalledWith('2', { $inc: { quantity: 1 } });
      expect(mockSale.save).toHaveBeenCalled();
      expect(recalculateRevenue).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
         updatedSale: expect.objectContaining({ returnedToInventory: true }),
         revenueStats: { dailyRevenue: 100, weeklyRevenue: 500, monthlyRevenue: 2000 }
      });
   });

   it('should handle invalid category', async () => {
      const mockSale = {
         status: 'voided',
         returnedToInventory: false,
         items: [{ productId: '1', quantity: 1, category: 'invalidCategory' }]
      };
      Sale.findById = jest.fn().mockResolvedValue(mockSale);

      await returnStock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid category' });
   });

   it('should handle errors', async () => {
      Sale.findById = jest.fn().mockRejectedValue(new Error('Test error'));

      await returnStock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
         message: 'Error returning stock',
         error: 'Test error'
      });
   });
});