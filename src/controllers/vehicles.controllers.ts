import { Request, Response } from "express";
import Vehicle from "@database/nosql/models/vehicle.model";
import { extractUserFromToken } from "@middleware/auth.middleware";

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const userUuid = extractUserFromToken(req);
    const vehicles = await Vehicle.find({ user: userUuid });
    return res.status(200).send({ status: 200, message: 'Vehicles retrieved successfully', data: { vehicles } });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      message: 'An error occurred while retrieving vehicles.',
      data: { error }
    });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const userUuid = extractUserFromToken(req);
    const { licensePlate, vin, make, vehicleType } = req.body;
    const vehicle = new Vehicle({
      licensePlate,
      vin,
      make,
      vehicleType,
      user: userUuid
    });
    await vehicle.save();
    return res.status(201).send({ status: 201, message: 'Vehicle created successfully', data: { vehicle } });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      message: 'An error occurred while creating the vehicle.',
      data: { error }
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userUuid = extractUserFromToken(req);
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id: id, user: userUuid },
      req.body,
      { new: true }
    );
    if (!updatedVehicle) {
      return res.status(404).send({ status: 404, message: 'Vehicle not found or not authorized' });
    }
    return res.status(200).send({ status: 200, message: 'Vehicle updated successfully', data: { vehicle: updatedVehicle } });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      message: 'An error occurred while updating the vehicle.',
      data: { error }
    });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userUuid = extractUserFromToken(req);
    const deletedVehicle = await Vehicle.findOneAndDelete({ _id: id, user: userUuid });
    if (!deletedVehicle) {
      return res.status(404).send({ status: 404, message: 'Vehicle not found or not authorized' });
    }
    return res.status(200).send({ status: 200, message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      message: 'An error occurred while deleting the vehicle.',
      data: { error }
    });
  }
};
