'use strict'

const express = require('express');
const app = express();
const dbMethods = require('./db-functions');


app.use(express.json());
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/playlists', async (req, res) => {
  try {
    let data = await dbMethods.showPlaylists();
    if(data.length === 0) {
      throw new Error(`Error: Playlists were not found!`)
    }
    res.status(200).json(data);
  } catch(err) {
    console.log(err);
    res.status(404);
    return;
  }
});

app.post('/playlists', async (req, res) => {
  try {
    let data = await dbMethods.insertPlaylist(req.body.title, 0);
    if(data.length === 0) {
      throw new Error(`Bad request!`)
    }
    res.status(200).json(data);
  } catch(err) {
    console.log(err);
    res.status(400);
    return;
  }
});

app.delete('/playlists/:id', async (req, res) => {
  try {
    let data = await dbMethods.deletePlaylist(req.params.id);
    if(data.length === 0) {
      throw new Error(`Error: Bad request!`)
    }
    res.status(200).json(data);
  } catch(err) {
    console.log(err);
    res.status(400);
    return;
  }
})

module.exports = app;