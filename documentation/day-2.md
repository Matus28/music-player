# Day 2: Frontend code & create a mock backend

This day you'll work in pairs: <https://www.agilealliance.org/glossary/pairing/>

## Backend stories

### Mock a backend service

- Check out the [specification](specification.md#rest-api) and create the
  scaffolding of the backend using Express
- Only create the `GET` parts for both the `playlist-tracks` and `playlists`
  endpoints
- Mocking means that you have to crate a "fake" service, like `/playlist-tracks`
  that returns hard-coded data in the expected JSON format

## Frontend stories

Consider using a template library, like
[Mustache](https://github.com/janl/mustache.js) to render lists

### Event listeners

- Add event listeners to all interactive parts of the UI according to the
  specification
- `console.log` that the events are successfully registered

### Frontend API calls

- Create a general function that will be responsible for communicating with
  your backend
- Create the asynchronous calls to the mock backend service

### Create the playlist functionality

- This will require a data model that stores your tracks
- First, on the app's initialization, load all the playlists from the backend
- If the user clicks on one playlist, update the tracks on the right
- The playlist should store a single list of tracks that can be played
- It should be responsible for playing the next track

  - Think of the shuffle feature
  - Think of the circular nature of the playlist

### Build the Audio object

- Wrap the following functionality into a function constructor:

  - Play audio
  - Pause audio
  - Load an MP3 file
  - Skip to percent (0 - 100%)
  - Sets the volume (0 - 100%)

- You can build an experiment on this, and reuse the file that contains the
  audio object later

- You can thank me for that later

### Follow the specification

- Read the specification and fill in the missing gaps

## Testing

### Frontend testing

- Add unit testing for the audio object :)
- Use Mocha <https://mochajs.org/>

### Backend testing

- Write Jest tests that ensure that you indeed return the correct data
  structure with your API endpoints