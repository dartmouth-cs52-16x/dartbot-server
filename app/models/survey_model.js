import mongoose, { Schema } from 'mongoose';

// create a schema for posts with a field
const SurveySchema = new Schema({
  question: String,
  meanResponse: Number,
  numResponses: Number,
  sum: Number,
});

// mapping from _id to id
SurveySchema.set('toJSON', {
  virtuals: true,
});

// create model class
const SurveyModel = mongoose.model('Survey', SurveySchema);

export default SurveyModel;
