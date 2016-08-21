import mongoose, { Schema } from 'mongoose';

// create a schema for posts with a field
const BioSchema = new Schema({
  name: String,
  major: String,
  year: String,
  content: String,
  image: String,
});

// mapping from _id to id
BioSchema.set('toJSON', {
  virtuals: true,
});

// create model class
const BioModel = mongoose.model('Bio', BioSchema);

export default BioModel;
