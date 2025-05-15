import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  phone: string;
  addhaar: string;
  email: string;
  profileimg: string;
  addharImg: string;
  region: string;
  state: string;
  district: string;
  registrationDate: Date;
  status: string;
}

const PlayerSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  addhaar: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profileimg: { type: String, required: true },
  addharImg: { type: String, required: true },
  region: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

export default mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
