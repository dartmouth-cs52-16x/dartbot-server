# DartBot -- Back End

API for DartBot - The Virtual Tour Guide Bot
DartBot (Tour Guide) provides prospective students with a tour of Dartmouth by (1) providing information about various locations across campus and directions to the next stop of the tour and (2) answering questions they may have using a Facebook Messenger ChatBot.

This repo contains the code for the API server backend portion of the project.

## Architecture

Our code is organized into three main repos: the API backend, the DartBot Tour Guide frontend and the Facebook Messenger bot using botkit.
The API stores Loc (Location) of sites on the tour with the gps coordinates of the location and the content related to this location.
The Profile schema (used in our bio page) stores the name and a description of each tour guide.

We will be using mongodb and mongoose to store and access the API.
TODO:  descriptions of code organization and tools and libraries used

## Setup


TODO: how to get the project dev environment up and running, npm install etc

## Deployment

The project is deployed to heroku with the following app instance url:

`http://dartmouthbot.herokuapp.com/`

## API Endpoints

Note that all endpoints are prefixed with `/api`, i.e. it is `http://dartmouthbot.herokuapp.com/api/locs` not `http://dartmouthbot.herokuapp.com/locs`

#### Location

- GET `/api/locs` returns gps (lat, long) and content for all locations

example return:

```javascript
// original query: http://dartmouthbot.herokuapp.com/api/locs
[
  {
    "_id": "57b24937a708162200b52f66",
    "name": "Kemeny Hall"
    "content": "Home of the Math departments and great classrooms",
    "gps": {
      "lat": "35.364",
      "long": "24.3423"
    },
    "id": "57b24937a708162200b52f66"
  },
  {
    "_id": "57b24f01a708162200b52f67",
    "content": "dartmouth hall is the best hall to known to man",
    "gps": {
      "lat": "3234.4444",
      "long": "24.3423"
    },
    "id": "57b24f01a708162200b52f67"
  }
]
```
- POST `/api/locs` with fields `{ gps: { lat: '' , long: '' }, content:'' }` creates a new location (w/ gps and content).
- GET `/api/locs/:id` with field `{ id: '' }` returns gps (lat, long) for a specific location
- PUT `/api/locs/:id` with field `{ id: '' }` edits an existing location with the passed in `id`
- DELETE `/api/locs/:id` with field `{ id: '' }` deletes an existing location with the passed in `id`

### Location Frequency
TODO
- GET .... returns array of locations and their frequency of being called

### (Intent? Q&A? Something clever)
- POST '....' with fields `{ intent: '', answer: '' }`
- GET '....' returns frequency of particular intent in questions

### Survey Feedback
- POST '....' unclear
- GET `...` returns array of the following fields `{ question: '', feedback: [{ answer: '', feedback: '' },..] }`

#### Bio

- GET `/api/bios` returns name, content, and image (TODO) for all tour guide bios
- POST `/api/bios` with fields `{name: '', content: '',  image: '' }` creates a new bio (w/ name, content, and image as listed).
- GET `/api/bios/:id` with fields `{id: '' }` returns name, content, and image (TODO) for tour guide bio having id equal to passed in id
- PUT `/api/bios/:id` with fields `{id: '' }` edits an existing bio possessing the passed in `id`
- DELETE `/api/bios/:id` with fields `{id: '' }` deletes an existing bio possessing the passed in `id`

#### Authentication

- POST `/api/signin` with fields `{email: '', password: '', username: '' }` logs in a pre-existing user
- POST `/api/signup` with fields `{email: '', password: '', username: '' }` creates a user account with passed in email address, username, and password as fields (fancy auth done for to preserve password security). Also logs user in.

## Authors

Ahsan Azim, Alma Wang


# TODO
***

- thoroughly test w/ actual frontend (rudimentary testing already done via other means)
- setup S3 for image storage
