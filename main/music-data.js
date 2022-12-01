'use strict'

const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'music')
const mm = require('musicmetadata');

const getFilesName = () => {
  return new Promise((resolve, reject) => {
    let filesName = [];
    try {
      fs.readdir(directoryPath, function (err, files) {
        if(err) {
          throw new Error(`Unable to scan directory: ${err}`);
        }
        files.forEach((file) => {
          filesName.push(file);
        })
        resolve(filesName);
      })
    } catch(err) {
      console.log(err);
      reject(err);
      return;
    }
  })
}

const getMetadata = (song) => {
  return new Promise((resolve, reject) => {
    try {
      let readableStream = fs.createReadStream(`./music/${song}`);
      let parser = mm(readableStream, {duration: true}, function (err, metadata) {
        if (err) {
          throw err;
        }
        readableStream.close();
        metadata.path = `./music/${song}`;
        return resolve(metadata);
      });
    } catch(err) {
      console.log(err);
      reject(err);
      return;
    } 
  })
}

// const printData = async () => {
//   let output = await getMetadata(`Organoid_-_09_-_Purple_Drift.mp3`);
//   console.log(output);
// }

// printData();

module.exports = {
  getFilesName,
  getMetadata
}
