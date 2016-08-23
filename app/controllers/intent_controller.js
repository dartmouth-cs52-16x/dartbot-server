import Intent from '../models/intent_model';

// export const createIntent = (req, res) => {
//   const intent = new Intent();
//   intent.query = req.body.query;
//   intent.response = req.body.response;
//   intent.hits = 0;
//   intent.save()
//   .then(result => {
//     res.json({ message: 'Intent created!' });
//   })
//   .catch(error => {
//     res.json({ error });
//   });
// };

export const updateIntent = (req, res) => {
  Intent.findOne({ query: req.body.query }, 'hits',
    (err, docs) => {
      if (err) {
        res.send(err);
      }
      const oldNumHits = (docs !== null) ? docs.hits : 0;
      Intent.update({ query: req.body.query }, { query: req.body.query, response: req.body.response, hits: oldNumHits }, { upsert: true },
          (err, raw) => {
            if (err) {
              res.send(err);
            }
            res.json({ message: 'Intent updated / created !' });
          });
    });
};

export const getAnswer = (req, res) => {
  Intent.findOne({ query: req.body.query }, '_id query response hits',
    (err, docs) => {
      if (err) {
        res.send(err);
      }
      incrmntHits(docs.id, docs.hits);
      res.json(docs);
    });
};

function incrmntHits(id, currHits) {
  Intent.update({ _id: id }, { hits: currHits + 1 },
      (err, raw) => {
        if (err) {
          console.log(err);
        }
      });
}

export const getData = (req, res) => {
  Intent.find({}, '_id query response hits',
    (err, docs) => {
      if (err) {
        res.send(err);
      }
      res.json(docs);
    });
};
