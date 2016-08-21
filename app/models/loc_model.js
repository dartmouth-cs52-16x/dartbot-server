import mongoose, { Schema } from 'mongoose';

// create a schema for posts with a field
const LocSchema = new Schema({
  title: String,
  gps: { lat: String, long: String },
  content: String,
});

// mapping from _id to id
LocSchema.set('toJSON', {
  virtuals: true,
});

// create model class
const LocModel = mongoose.model('Loc', LocSchema);

export default LocModel;
