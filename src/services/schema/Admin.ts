import mongoose, { Schema, Document } from 'mongoose';
import { hash, compare } from 'bcrypt';

export interface IAdmin extends Document {
  username: string;
  password: string;
  email: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
});

// Pre-save hook to hash the password
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const hashedPassword = await hash(this.password as string, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return compare(candidatePassword, this.password as string);
};

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
