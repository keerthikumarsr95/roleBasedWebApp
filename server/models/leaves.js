import mongoose from 'mongoose';
import constants from '../helper/constants';

const { Schema } = mongoose;

let leavesSchema = new Schema({
  leaveId: {
    type: String,
    default: undefined
  },
  employeeId: {
    type: String,
    default: undefined
  },
  managerId: {
    type: String,
    default: undefined
  },
  employeeName: {
    type: String,
    default: undefined
  },
  status: {
    type: String,
    default: undefined, enum: [
      constants.PENDING,
      constants.APPROVED,
      constants.NOT_APPROVED,
      // constants.Applied
    ]
  },
  reason: {
    type: String,
    default: undefined
  },
}, { timestamps: true });

export default mongoose.model('Leaves', leavesSchema);