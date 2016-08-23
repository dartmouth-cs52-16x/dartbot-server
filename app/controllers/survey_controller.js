import Survey from '../models/survey_model';

export const createSurvey = (req, res) => {
  const survey = new Survey();
  survey.question = req.body.question;
  survey.meanResponse = 0;
  survey.numResponses = 0;
  survey.sum = 0;
  survey.save()
  .then(result => {
    res.json({ message: 'Survey created!' });
  })
  .catch(error => {
    res.json({ error });
  });
};


export const updateRating = (req, res) => {
  Survey.findOne({ question: req.body.question }, '_id question meanResponse numResponses sum',
    (err, docs) => {
      if (err) {
        res.send(err);
      }
      const newSum = docs.sum + Number(req.body.response);
      const newNumResponses = docs.numResponses + 1;
      const newMeanRating = newSum / newNumResponses;
      Survey.update({ question: req.body.question }, { question: req.body.question,
                      meanResponse: newMeanRating, numResponses: newNumResponses, sum: newSum },
          (err, raw) => {
            if (err) {
              res.send(err);
            }
            res.json({ message: 'rating accepted!' });
          });
    });
};


export const getData = (req, res) => {
  Survey.find({}, '_id question meanResponse numResponses',
    (err, docs) => {
      if (err) {
        res.send(err);
      }
      res.json(docs);
    });
};
