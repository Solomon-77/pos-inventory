const { addProduct } = require('./addProduct');
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

// Mock the category models and UserLog
jest.mock('../category_models/category');
jest.mock('../model/UserLog');

describe('addProduct', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            body: {
                category: 'generic',
                name: 'Test Product',
                quantity: 10,
                price: 9.99,
                criticalLevel: 5
            },
            user: { username: 'testUser' }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should add a product successfully', async () => {
        const mockSave = jest.fn();
        Generic.mockImplementation(() => ({
            save: mockSave
        }));

        await addProduct(mockReq, mockRes);

        expect(Generic).toHaveBeenCalledWith({
            name: 'Test Product',
            quantity: 10,
            price: 9.99,
            category: 'generic',
            criticalLevel: 5
        });
        expect(mockSave).toHaveBeenCalled();
        expect(UserLog.create).toHaveBeenCalledWith({
            user: 'testUser',
            action: 'Added Product',
            details: 'Added Test Product to generic category with critical level 5'
        });
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalled();
    });

    test('should return 400 for invalid category', async () => {
        mockReq.body.category = 'invalidCategory';

        await addProduct(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid category' });
    });

    test('should handle errors and return 500', async () => {
        const mockError = new Error('Test error');
        Generic.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(mockError)
        }));

        await addProduct(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Test error' });
    });

    test('should use "System" as user when req.user is not present', async () => {
        mockReq.user = null;
        const mockSave = jest.fn();
        Generic.mockImplementation(() => ({
            save: mockSave
        }));

        await addProduct(mockReq, mockRes);

        expect(UserLog.create).toHaveBeenCalledWith({
            user: 'System',
            action: 'Added Product',
            details: expect.any(String)
        });
    });

    // Add more tests for different categories if needed
});