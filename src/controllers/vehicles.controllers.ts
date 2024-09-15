import { Request, Response } from "express";
import Vehicle from "@database/nosql/models/vehicle.model";
import { extractUserFromToken } from "@middleware/auth.middleware";
import User from "@database/nosql/models/user.model";
import { v4 as uuidv4 } from 'uuid';

/**
 * The function `getVehicles` retrieves vehicles based on user UUID with pagination support and error
 * handling.
 * @param {Request} req - The `req` parameter in the `getVehicles` function stands for the request
 * object, which contains information about the HTTP request made to the server. This object includes
 * details such as the request headers, query parameters, body content, and more. In this specific
 * function, the `req` parameter
 * @param {Response} res - The `res` parameter in the `getVehicles` function stands for the response
 * object in Express.js. It is used to send a response back to the client making the request. In this
 * function, `res` is used to send a success response with the retrieved vehicles data or an error
 * response
 * @returns The `getVehicles` function returns a response with status code 200 if the vehicles are
 * retrieved successfully. The response includes a message indicating success, along with data
 * containing the retrieved vehicles, current page number, total pages, and total number of vehicles.
 */
export const getVehicles = async (req: Request, res: Response) => {
  try {
    const userUuid = extractUserFromToken(req);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalVehicles = await Vehicle.countDocuments({ userUuid });
    const vehicles = await Vehicle.find({ userUuid })
      .select('-_id -__v') // Omit _id and __v fields
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalVehicles / limit);

    return res.status(200).send({
      status: 200,
      message: 'Vehicles retrieved successfully',
      data: {
        vehicles,
        currentPage: page,
        totalPages,
        totalVehicles
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      message: 'An error occurred while retrieving vehicles.',
      data: { error }
    });
  }
};

/**
 * The function creates a new vehicle associated with a user and returns a success message or an error
 * message.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `createVehicle` function is an object
 * representing the HTTP response that the server sends back to the client. It allows you to send data,
 * set status codes, and control the response that the client receives after the request is processed.
 * @returns The `createVehicle` function returns a response based on the outcome of the vehicle
 * creation process. If the vehicle is successfully created, it returns a status of 201 along with a
 * message indicating success and the created vehicle data. If there is an error during the creation
 * process, it returns a status of 500 along with an error message and details about the error
 * encountered.
 */
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const userUuid = extractUserFromToken(req);
    const { licensePlate, vin, make, vehicleType } = req.body;
    const user = await User.findOne({ uuid: userUuid });
    if (!user) {
      return res.status(404).send({ status: 404, message: 'User not found' });
    }
    const vehicle = new Vehicle({
      uuid: uuidv4(),
      licensePlate,
      vin,
      make,
      vehicleType,
      userId: user._id,
      userUuid
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

/**
 * This function updates a vehicle record in a database based on the provided ID and user
 * authorization.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `updateVehicle` function is an object
 * representing the HTTP response that an Express.js route handler sends when it receives an HTTP
 * request. It allows you to send back a response to the client making the request.
 * @returns If the vehicle is successfully updated, a response with status code 200, message 'Vehicle
 * updated successfully', and the updated vehicle data will be returned. If the vehicle is not found or
 * the user is not authorized, a response with status code 404 and message 'Vehicle not found or not
 * authorized' will be returned. If an error occurs during the update process, a response with status
 * code 500
 */
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    const userUuid = extractUserFromToken(req);
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { uuid: id, userUuid },
      req.body,
      { new: true, select: '-_id -__v' }
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

/**
 * This function deletes a vehicle based on the provided ID and user authorization.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `deleteVehicle` function stands for the response
 * @returns If the vehicle is successfully deleted, a response with status code 200 and message
 * 'Vehicle deleted successfully' is being returned. If the vehicle is not found or not authorized, a
 * response with status code 404 and message 'Vehicle not found or not authorized' is being returned.
 * If an error occurs during the deletion process, a response with status code 500, message 'An error
 * occurred while deleting
 */
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userUuid = extractUserFromToken(req);
    const deletedVehicle = await Vehicle.findOneAndDelete({ uuid: id, userUuid });
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
