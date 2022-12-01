'use strict'

const query = require('./db');
const {getFilesName, getMetadata} = require('./music-data');

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
  let allTracks = await showSpecificPlaylist(`All tracks`)
  if( allTracks.length === 0) {
    let insertedPlaylist = await insertPlaylist('All tracks', 1);
    let insertedTracklist = await insertTrackslist(insertedPlaylist[0].id, metadataList);
  } else if (false) {

  }
  // let needUpdate = await checkIfNeedsUpdate(metadataList.length);
}

const showSpecificPlaylist = async (playlistName) => {
  let output = await query(`SELECT * FROM playlists WHERE title = ?`, [playlistName]);
  return output;
}

const showSpecificTrackList = async (playlistId) => {
  let output = await query(`SELECT * FROM trackslist WHERE playlist_id = ?`, [playlistId]);
  return output;
}

const insertPlaylist = async (title, systemRank) => {
  let report = await query(`INSERT INTO playlists (title, system_rank) VALUES (?, ?)`, [title, systemRank]);
  let output = await query(`SELECT * FROM playlists WHERE id = ?`, [report.insertId]);
  return output;
}

const insertTrackslist = async (playlist_id, metadataList) => {
  let output;
  for (let i = 0; i < metadataList.length; i++) {
    output = await query(`INSERT INTO trackslist (title, artist, duration, path, playlist_id) 
    VALUES (?, ?, ?, ?, ?)`, [metadataList[i].title, metadataList[i].artist, metadataList[i].duration, metadataList[i].path, playlist_id]);
  }
  let createdTrackslist = await showSpecificTrackList(playlist_id);
  return createdTrackslist;
}

// const checkIfNeedsUpdate = async (length) => {
//   const lengthDB = await query('SELECT COUNT(*) FROM ')
// }

const showPlaylists = async () => {
  const list = await getFilesName();
  let metadataList = [];
  for (let i = 0; i < list.length; i++) {
    let data = await getMetadata(list[i]);
    metadataList.push(data)
  }
  // console.log(metadataList);
  initTable(metadataList);
}

module.exports = {
  showPlaylists
}