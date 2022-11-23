'use strict'

const musicContainer = document.querySelector('.music-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const title = document.querySelector('#title');
const cover = document.querySelector('#cover');

// Song titles
const songs = ['Ars_Sonor_-_02_-_Never_Give_Up', 'Organoid_-_09_-_Purple_Drift'];

// Keep track of songs
let songIndex = 0

// Initially load song into DOM
loadSong(songs[songIndex]) 

// Update song details
function loadSong(song) {
  title.innerText = song;
  audio.src = `./${song}.mp3`;
  cover.src = `./${song}.png`;
}

function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('img.fas').classList.remove('fa-play');
  playBtn.querySelector('img.fas').classList.add('fa-pause');
  playBtn.querySelector('img.fas').setAttribute('src', './pause.svg');
  
  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('img.fas').classList.remove('fa-pause');
  playBtn.querySelector('img.fas').classList.add('fa-play');
  playBtn.querySelector('img.fas').setAttribute('src', './play.svg');

  audio.pause();
}

function prevSong() {
  songIndex--;

  if(songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);

  playSong();
}

function nextSong() {
  songIndex++;

  if(songIndex >= songs.length) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);

  playSong();
}

function updateProgress(e) {
  // console.log(e.srcElement);
  // console.log(e.srcElement.duration)
  // console.log(e.srcElement.currentTime);
  const {duration, currentTime} = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  // console.log(width);
  // console.log(clickX);
  // console.log(duration);

  audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if(isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
})

// Change song events
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);

audio.addEventListener('ended', nextSong);

progressContainer.addEventListener('click', setProgress);