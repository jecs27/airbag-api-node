import { Request, Response } from 'express';
import * as vehicleController from '../controllers/vehicles.controllers';
import Vehicle from '@database/nosql/models/vehicle.model';
import { extractUserFromToken } from '@middleware/auth.middleware';

jest.mock('@database/nosql/models/vehicle.model');
jest.mock('@database/nosql/models/user.model');
jest.mock('@middleware/auth.middleware');

describe('Vehicle Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {
      query: {},
    };
    responseObject = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockImplementation((result) => {
        responseObject = result;
      }),
    };
  });

  describe('getVehicles', () => {
    it('should return vehicles with pagination', async () => {
      const mockVehicles = [{ uuid: 'v1', make: 'Toyota' }, { uuid: 'v2', make: 'Honda' }];
      (extractUserFromToken as jest.Mock).mockReturnValue('user123');
      (Vehicle.countDocuments as jest.Mock).mockResolvedValue(2);
      (Vehicle.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockVehicles),
      });

      await vehicleController.getVehicles(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.data.vehicles).toEqual(mockVehicles);
      expect(responseObject.data.totalVehicles).toBe(2);
    });
  });

  describe('updateVehicle', () => {
    it('should update an existing vehicle', async () => {
      mockRequest.params = { id: 'vehicle123' };
      mockRequest.body = { make: 'Honda' };
      const updatedVehicle = { uuid: 'vehicle123', make: 'Honda' };
      
      (extractUserFromToken as jest.Mock).mockReturnValue('user123');
      (Vehicle.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedVehicle);

      await vehicleController.updateVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        status: 200,
        message: 'Vehicle updated successfully',
        data: { vehicle: updatedVehicle },
      });
    });
  });

  describe('deleteVehicle', () => {
    it('should delete an existing vehicle', async () => {
      mockRequest.params = { id: 'vehicle123' };
      
      (extractUserFromToken as jest.Mock).mockReturnValue('user123');
      (Vehicle.findOneAndDelete as jest.Mock).mockResolvedValue({ uuid: 'vehicle123' });

      await vehicleController.deleteVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        status: 200,
        message: 'Vehicle deleted successfully',
      });
    });
  });
});
