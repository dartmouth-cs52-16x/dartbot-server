import mongoose, { Schema } from 'mongoose';

// create a schema for posts with a field
const IntentSchema = new Schema({
  query: String,
  response: String,
  hits: Number,
});

// mapping from _id to id
IntentSchema.set('toJSON', {
  virtuals: true,
});

// create model class
const IntentModel = mongoose.model('Intent', IntentSchema);

export default IntentModel;
