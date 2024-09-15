import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  uuid: string;
  name: string;
  phone: string;
  email: string;
  temporaryCode: string | null;
}

const userSchema: Schema = new Schema({
  uuid: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  temporaryCode: { type: String, default: null }
});

const User = mongoose.model<IUser>('Users', userSchema);

export default User;
