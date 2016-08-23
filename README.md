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

# take note of change from `/api/locs/closest` to `/api/data/closest`

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
- POST `/api/intent` with fields `{ query: '', response: '' }`, where `query` represents the 'intent' of the content, and `response` represents our desired content corresponding to said query.
- **[ FOR BOT ]** PUT `/api/intent` with fields `{ query: '' }` returns the intent object (i.e. `{ query: '', response: '', hits: '' }` ) with `query` field corresponding to the query passed in.


> An aside: the reader may wonder why we chose to perform a `PUT` request for the above operation, when a `GET` may intuitively seem more appropriate. The reason here is that this query will be performed by a facebook messenger bot. We desired that the bot be independent of url parameter requirements (hence meaning that it wouldn't store, say, anything accessible through `req.params.id` - therefore, we'd require some other sort of identifier to select what information to pull out of the database and return to the bot. Supplying such additional information would need to be done through the body of the HTTP request - something not desirable when dealing with `GET` requests. Therefore, a payload-compliant verb was necessary, and I chose `PUT` ;)

- **[ ANALYTICS ]** GET `/api/intent/data` returns `[ { query: '', hits: '' }, ...]` array with entries corresponding to each intent object stored (where `hits` is a Number corresponding to the frequency with which said intent has been queried by the bot. This is, again, a reasonable barometer of popularity of queries).

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
Ahsan Azim, Alma Wang, Ian Bateman, Larissa Chen, Robin Jayaswal
