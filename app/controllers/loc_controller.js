import Loc from '../models/loc_model';

export const createLoc = (req, res) => {
  const loc = new Loc();
  loc.gps = req.body.gps;
  loc.content = req.body.content;
  loc.title = req.body.title;
  loc.hits = 0;
  loc.save()
  .then(result => {
    res.json({ message: 'Location created!' });
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getLocs = (req, res) => {
  Loc.find({}, '_id gps content title hits',
    (err, docs) => {
      if (err) {
        res.send(err);
      }
      res.json(docs);
    });
};

export const getLoc = (req, res) => {
  Loc.findById(req.params.id, '_id gps content title',
    (err, docs) => {
      if (err) {
        res.send(err);
      }
      res.json(docs);
    });
};

export const updateLoc = (req, res) => {
  Loc.update({ _id: req.params.id }, { gps: req.body.gps, content: req.body.content, title: req.body.title },
      (err, raw) => {
        if (err) {
          res.send(err);
        }
        getLoc(req, res);
      });
};

export const deleteLoc = (req, res) => {
  Loc.remove({ _id: req.params.id },
    (err) => {
      res.send(err);
    });
};

// My implementation of the Haversine formula for
// calculating distances between two lat, lon points
function calcDist(lat1, lon1, lat2, lon2) {
  const R = 6371e3; 					                      // radius of earth in metres

  const phi1 = lat1 * Math.PI / 180;                     // lat in radians
  const phi2 = lat2 * Math.PI / 180;		                 // lon in radians

  const phiDelt = (lat2 - lat1) * Math.PI / 180;         // diff b/w lat, in rad
  const phiLambda = (lon2 - lon1) * Math.PI / 180;       // diff b/w lon, in rad

  const a = Math.sin(phiDelt / 2) * Math.sin(phiDelt / 2) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(phiLambda / 2) * Math.sin(phiLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; 			                               // actual final distance

  return d;
}

function incrmntHits(id, currHits) {
  Loc.update({ _id: id }, { hits: currHits + 1 },
      (err, raw) => {
        if (err) {
          console.log(err);
        }
      });
}

export const getClosest = (req, res) => {
  Loc.find({}, '_id gps content title hits',
    (err, docs) => {
      if (err) {
        res.send(err);
      }
      let closestDocIndex = 0;            // proxy initial closest index
      const userLat = req.body.lat;
      const userLon = req.body.lon;

      // compare current closest to each other one, change if necessary
      docs.forEach((currValue, index) => {
        const currLat = docs[index].gps.lat;
        const currLon = docs[index].gps.long;
        const currClosLat = docs[closestDocIndex].gps.lat;
        const currClosLon = docs[closestDocIndex].gps.long;
        if (calcDist(userLat, userLon, currLat, currLon) <
            calcDist(userLat, userLon, currClosLat, currClosLon)) {
          closestDocIndex = index;
        }
      });

      const closestLoc = docs[closestDocIndex];

      incrmntHits(closestLoc.id, closestLoc.hits);

      res.json(closestLoc);
    });
};


export const getData = (req, res) => {
  Loc.find({}, '_id title hits',
    (err, docs) => {
      if (err) {
        res.send(err);
      }
      res.json(docs);
    });
};
