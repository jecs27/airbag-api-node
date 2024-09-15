import mongoose, { Document, Schema } from 'mongoose';

// Interface defining the structure of a Vehicle document
interface IVehicle extends Document {
  uuid: string;
  licensePlate: string;
  vin: string;
  make: string;
  vehicleType: string;
  userUuid: string;
}

// Schema definition for the Vehicle model
const vehicleSchema: Schema = new Schema({
  uuid: { type: String, required: true, unique: true },
  licensePlate: { type: String, required: true },
  vin: { type: String, required: true, unique: true },
  make: { type: String, required: true },
  vehicleType: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userUuid: { type: String, required: true }
});

// Create and export the Vehicle model
const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);

export default Vehicle;
