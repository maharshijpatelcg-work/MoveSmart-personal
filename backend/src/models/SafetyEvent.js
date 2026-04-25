// MoveSmart — Safety Event Model
import mongoose from 'mongoose';

const safetyEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['sos', 'share', 'night', 'contact'], required: true },
    message: { type: String, required: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SafetyEvent = mongoose.model('SafetyEvent', safetyEventSchema);
export default SafetyEvent;
