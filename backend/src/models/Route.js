// MoveSmart — Route Model (transport routes, not Express routes)
import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    origin: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    destination: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    stops: [
      {
        name: String,
        lat: Number,
        lng: Number,
        estimatedArrival: String,
      },
    ],
    distance: { type: String, default: '' },
    duration: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive', 'delayed'], default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Route = mongoose.model('Route', routeSchema);
export default Route;
