import mongoose from 'mongoose';

const { Schema } = mongoose;

let EmployeesSchema = new Schema({
  name: { type: String, default: undefined },
  // employeeId: { type: String, default: undefined },
  type: { type: String, default: undefined },
  password: { type: String, default: undefined },
  email: { type: String, default: undefined, unique: true },
  managerName: { type: String, default: undefined },
  managerUUID: { type: String, default: undefined },
  createdBy: { type: String, default: undefined },
}, { timestamps: true });

export default mongoose.model('Employees', EmployeesSchema);