# DartBot -- Back End

API for DartBot - The Virtual Tour Guide Bot
DartBot (Tour Guide) provides prospective students with a tour of Dartmouth by (1) providing information about various locations across campus and directions to the next stop of the tour and (2) answering questions they may have using a Facebook Messenger ChatBot.

This repo contains the code for the API server backend portion of the project.

## Architecture

Our code is organized into four main repos: the API backend, the DartBot Tour Guide frontend, the Facebook Messenger bot using botkit, and the iOS companion App.
The API backend stores and updates information for both the Web App and Messenger Bot components.
Data is stored as 5 main schemas: Bio (Tour Guide Profiles), Intent (Queries), Loc (Location), Survey and User (for signing up and signing in admins).
We will be using MongoDB and mongoose to store the database and Express to establish routes for accessing the API.

## Setup

The backend requires the environment variables API_SECRET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME and  MONGODB_URI.

The backend of the project uses Passport.js to create tokens which requires an API_SECRET environment variable. This can be any established random string.

After setting up Amazon S3 for storage, Amazon provides an access key id and secret access key that need to be set up as their respective environmental variables in this project. In addition, after choosing a name for the S3 bucket, set the S3_BUCKET_NAME as the name.

If using Heroku to deploy the project with the mLab MongoDB add-on, the MONGODB_URI variable will automatically be created. Otherwise the URI should be obtained from MongoDB and added as an environmental variable.


## Deployment

This project is currently deployed to Heroku with automatic deployment with a connected GitHub repository on the following app instance url:

`http://dartmouthbot.herokuapp.com/`

## API Endpoints

Note that all endpoints are prefixed with `/api`, i.e. it is `http://dartmouthbot.herokuapp.com/api/locs` not `http://dartmouthbot.herokuapp.com/locs`

#### Location

- GET `/api/locs` returns full objects for all locations
- POST `/api/locs` with fields `{ title: '', gps: { lat: '' , long: '' }, content:'' }` creates a new location (w/ gps, title, and content).
- GET `/api/locs/:id` with field `{ id: '' }` returns full object for a specific location
- PUT `/api/locs/:id` with field `{ id: '' }` edits an existing location with the passed in `id` (*we do not anticipate this command to be used*)
- DELETE `/api/locs/:id` with field `{ id: '' }` deletes an existing location with the passed in `id`
- **[ FOR BOT ]** PUT `/api/data/closest` with fields `{ lat: '', lon: '' }` (corresponding to the latitude and longitude user has sent through facebook) returns location object (i.e. `{ title: '', gps: { lat: '' , long: '' }, content:'' }`) of the location closest to user's coordinates.
- **[ ANALYTICS ]** GET `/api/locs/data` returns `[ {title: '', hits: '' }, ...]` array with entries corresponding to each location stored (where `hits` is a Number corresponding to the number of times a user has been registered as 'closest' to that specific location - as defined by the PUT method above - this is a reasonable proxy for popularity of locations / most visited locations).   

### Intent
- PUT `/api/intent/edit` with fields `{ "query": "", "response": "" }` updates the `response` field of the intent object with `query` field corresponding to the query passed in. **If that query did not exist, it creates an Intent object with the corresponding query and response fields.**

> That last PUT was not REST-ful at all, yet needs must :(

- **[ FOR BOT ]** PUT `/api/intent` with fields `{ query: '' }` returns the intent object (i.e. `{ query: '', response: '', hits: '' }` ) with `query` field corresponding to the query passed in.


> An aside: the reader may wonder why we chose to perform a `PUT` request for the above operation, when a `GET` may intuitively seem more appropriate. The reason here is that this query will be performed by a facebook messenger bot. We desired that the bot be independent of url parameter requirements (hence meaning that it wouldn't store, say, anything accessible through `req.params.id` - therefore, we'd require some other sort of identifier to select what information to pull out of the database and return to the bot. Supplying such additional information would need to be done through the body of the HTTP request - something not desirable when dealing with `GET` requests. Therefore, a payload-compliant verb was necessary, and I chose `PUT` ;)

- **[ ANALYTICS ]** GET `/api/intent/data` returns `[ { query: '', hits: '' }, ...]` array with entries corresponding to each intent object stored (where `hits` is a Number corresponding to the frequency with which said intent has been queried by the bot. This is, again, a reasonable barometer of popularity of queries).


#### Bio

- GET `/api/bios` returns name, content, and image (TODO) for all tour guide bios
- POST `/api/bios` with fields `{name: '', content: '',  image: '' }` creates a new bio (w/ name, content, and image as listed).
- GET `/api/bios/:id` with fields `{id: '' }` returns name, content, and image (TODO) for tour guide bio having id equal to passed in id
- PUT `/api/bios/:id` with fields `{id: '' }` edits an existing bio possessing the passed in `id`
- DELETE `/api/bios/:id` with fields `{id: '' }` deletes an existing bio possessing the passed in `id`

#### Authentication

- POST `/api/signin` with fields `{ email: '', password: '', username: '' }` logs in a pre-existing user
- POST `/api/signup` with fields `{ email: '', password: '', username: '' }` creates a user account with passed in email address, username, and password as fields (fancy auth done for to preserve password security). Also logs user in.

#### Survey feedback
- **[ ANALYTICS ]** GET `/api/survey`  returns `[ { question: '', meanResponse: '', numResponses: '' }, ...]` array with entries corresponding to the feedback question, the number of responses it's received, and the mean response received. Note that responses are numbers from 1 to 5, hence the mean response rating is also a number in the implied range.
- **[ FOR BOT ]** PUT `/api/survey` with fields `{ question: '', response: '' }` updates the mean response (/rating) that the question has received. Calculations in creating arriving new mean are unnecessary to repeat here, what must be noted though is that the `question` field must be a String corresponding *exactly* - punctuation, case, et al - to the question one intends to update the rating of. Finally, it bears repeating that the response should be a number from 1-5 inclusive.
- POST `/api/survey` with field `{ question: '' }` creates a survey object in the backend, with `question`'s value corresponding to that of the passed-in field, both numResponses and meanResponse initialized - as one would expect - to 0.

## Authors
Ahsan Azim, Alma Wang, Ian Bateman, Larissa Chen, Robin Jayaswal
