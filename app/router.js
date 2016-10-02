// import controllers + express routing
import { Router } from 'express';
import * as Loc from './controllers/loc_controller';
import * as Bio from './controllers/bio_controller';
import * as User from './controllers/user_controller';
import * as Intent from './controllers/intent_controller';
import * as Survey from './controllers/survey_controller';
import { requireAuth, requireSignin } from './services/passport';
import { ddsScraping } from 'services/scraping.js';

// init Router
const router = Router();

// home dir
router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

// locations

router.route('/locs')
  .post(requireAuth, Loc.createLoc)       // add new loc
  .get(Loc.getLocs);                         // get all locs

router.route('/data/closest')                // CHANGED -- was causing issues before
  .put(Loc.getClosest);

router.route('/locs/data')                   // for web/app -> analytics page
  .get(Loc.getData);

router.route('/locs/:id')
  .put(requireAuth, Loc.updateLoc)           // edit existing loc
  .get(Loc.getLoc)                           // get single loc
  .delete(requireAuth, Loc.deleteLoc);    // delete single loc


// bios
router.route('/bios')
  .post(requireAuth, Bio.createBio)          // add new bio
  .get(Bio.getBios);                         // get all bios

router.post('/images', Bio.getSignedRequest); // get S3 signed request for new image

router.route('/bios/:id')
  .put(requireAuth, Bio.updateBio)           // edit existing bio
  .get(Bio.getBio)                           // get single bio
  .delete(requireAuth, Bio.deleteBio);       // delete single bio

// login

router.post('/signin', requireSignin, User.signin);
router.post('/signup', User.signup);


// intent

router.route('/intent')
  .put(Intent.getAnswer);                          // get intent reply
  // .post(Intent.createIntent)                       // add new query-resp pair   --> UNUSED NOW

router.route('/intent/edit')            // ---> NOT RESTFUL AT ALL (yet needs must :( )
  .put(Intent.updateIntent);            // updates query-resp pair if there, creates if not

router.route('/intent/data')
  .get(Intent.getData);


// survey

router.route('/survey')
  .get(Survey.getData)               // get question-response stats
  .post(Survey.createSurvey)         // create question-response pair (with question only)
  .put(Survey.updateRating);         // calc new meanResponse using payload

// DDS Daily Menu
router.route('/ddsdailies')
  .post((req, res) => {
    ddsScraping();
  });
export default router;
