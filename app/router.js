// import controllers + express routing
import { Router } from 'express';
import * as Loc from './controllers/loc_controller';
import * as Bio from './controllers/bio_controller';
import * as User from './controllers/user_controller';
import * as Intent from './controllers/intent_controller';
import { requireAuth, requireSignin } from './services/passport';

// init Router
const router = Router();

// home dir
router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

// locations

router.route('/locs')
  .post(requireAuth, Loc.createLoc)          // add new loc
  .post(Loc.createLoc)                       // add new loc     ---> remove one
  .get(Loc.getLocs);                         // get all locs

router.route('/locs/closest')                // for bot -> resp to user loc
  .put(Loc.getClosest);

router.route('/locs/data')                   // for web/app -> analytics page
  .get(Loc.getData);

router.route('/locs/:id')
  .put(requireAuth, Loc.updateLoc)           // edit existing loc
  .get(Loc.getLoc)                           // get single loc
  .delete(requireAuth, Loc.deleteLoc);       // delete single loc


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
  .post(Intent.createIntent)                       // add new query-resp pair
  .put(Intent.getAnswer);                          // get intent reply

router.route('/intent/data')
  .get(Intent.getData);


export default router;
