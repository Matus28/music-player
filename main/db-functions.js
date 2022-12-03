'use strict'

const query = require('./db');
const {getFilesName, getMetadata} = require('./music-data');

// Initialization if playslists/trackslist was not created, or All tracks not contain all songs from root directory
const initTable = async (metadataList) => {
  let output = await query(`CREATE TABLE IF NOT EXISTS playlists (
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    system_rank INT
    );`); 
  output = await query(`CREATE TABLE IF NOT EXISTS trackslist (
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    duration INT(11) NOT NULL,
    path VARCHAR(255) NOT NULL,
    playlist_id INT,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id)
    );`)
  let allTracks = await showSpecificPlaylist(`All tracks`, '');
  let needUpdate = await checkIfNeedsUpdate(metadataList.length, allTracks[0].id);
  let favorites = await showSpecificPlaylist(`Favorites`, '');
  let insertedPlaylist = [];
  let insertedTracklist = [];

  if( allTracks.length === 0) {
    insertedPlaylist = await insertPlaylist('All tracks', 1);
    insertedTracklist = await insertTrackslist(insertedPlaylist[0].id, metadataList);
  } else if (needUpdate) {
    let actualTracklist = await deleteTrackslist(allTracks[0].id); 
    insertedTracklist = await insertTrackslist(allTracks[0].id, metadataList);
  }

  if(favorites.length === 0) {
    insertedPlaylist = await insertPlaylist('Favorites', 1);
  }
}

const showAllPlaylists = async () => {
  let output = [];
  output = await query(`SELECT * FROM playlists`);
  return output;
}

// Show playlist based on playlist TITLE
const showSpecificPlaylist = async (playlistName, playlistId) => {
  let output = [];
  if(playlistId.length === 0 && playlistName.length > 0) {
    output = await query(`SELECT * FROM playlists WHERE title = ?`, [playlistName]);
  } else if(playlistId.length > 0 && playlistName.length === 0) {
    output = await query(`SELECT * FROM playlists WHERE id = ?`, [playlistId]);
  }
  return output;
}


// Show tracklist (songs included to specific playlist ID)
const showSpecificTrackList = async (playlistId) => {
  let output = await query(`SELECT * FROM trackslist WHERE playlist_id = ?`, [playlistId]);
  return output;
}

// INSERT playlist in to the playlist table
const insertPlaylist = async (title, systemRank) => {
  let report = await query(`INSERT INTO playlists (title, system_rank) VALUES (?, ?)`, [title, systemRank]);
  let output = await query(`SELECT * FROM playlists WHERE id = ?`, [report.insertId]);
  return output;
}

// INSERT tracks/songs in to the trackslist table
const insertTrackslist = async (playlist_id, metadataList) => {
  let output;
  for (let i = 0; i < metadataList.length; i++) {
    output = await query(`INSERT INTO trackslist (title, artist, duration, path, playlist_id) 
    VALUES (?, ?, ?, ?, ?)`, [metadataList[i].title, metadataList[i].artist, metadataList[i].duration, metadataList[i].path, playlist_id]);
  }
  let createdTrackslist = await showSpecificTrackList(playlist_id);
  return createdTrackslist;
}

// DELETE songs from trackslist table based on playlist ID
const deleteTrackslist = async (playlistId) => {
  let report = await query(`DELETE FROM trackslist WHERE playlist_id = ?`, [playlistId]);
  let output = await query(`SELECT * FROM trackslist`);
  return output;  
}

// DELETE playlist by playlist id
const deletePlaylist = async (playlistId) => {
  let report = await query(`DELETE FROM playlists WHERE id = ?`, [playlistId]);
  let output = await showAllPlaylists();
  return output;
}

// CHECKing if there are all songs/tracks in trackslist for specific playlist
const checkIfNeedsUpdate = async (length, playlistId) => {
  const lengthDB = await query(`SELECT COUNT(*) FROM trackslist WHERE playlist_id = ?`, [playlistId]);
  if (length !== lengthDB[0]["COUNT(*)"]) {
    return true;
  }
  return false;
}

// Showing actual playlists (with basic initialization of tables if they are not existing)
const showPlaylists = async () => {
  let output = [];
  const list = await getFilesName();
  let metadataList = [];
  for (let i = 0; i < list.length; i++) {
    let data = await getMetadata(list[i]);
    metadataList.push(data)
  }
  // console.log(metadataList);
  initTable(metadataList);
  output = await query(`SELECT * FROM playlists`);
  return output;
}


module.exports = {
  showPlaylists,
  insertPlaylist,
  deletePlaylist
}