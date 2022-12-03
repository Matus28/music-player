'use strict'

const playlistsTable = document.getElementsByClassName('playlists-table')[0];
const newPlaylist = document.getElementsByClassName('new-playlist')[0];
const closeNewPlaylist = document.getElementsByClassName('close-newplaylist')[0];
const modalNewplaylist = document.querySelector("#modal-newplaylist");
const url = `http://localhost:3000`;
const svgDelete = `<svg class="delete-icon" viewBox="0 0 47 52" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 47 52"><path d="M45.243 41.757 31.455 26l13.788-15.758a6.001 6.001 0 0 0-8.486-8.485L23.5 16.909 10.243 1.757a6.001 6.001 0 0 0-8.486 8.485L15.545 26 1.757 41.757a6 6 0 1 0 8.486 8.485L23.5 35.09l13.257 15.152a6 6 0 1 0 8.486-8.485z" fill="#707070" class="fill-000000"></path></svg>`;

let options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}

const updatePlaylists = (data) => {
  playlistsTable.children[0].innerHTML = '';
  const tbodyPlaylists = playlistsTable.children[0];

  if(data.length === 0) {
    const pError = document.createElement('p');
    pError.style.margin = '10px';
    pError.textContent = `Couldn't find any playlist!`
    tbodyPlaylists.appendChild(pError);
  } else {
    for (let i = 0; i < data.length; i++) {
      const tr = document.createElement('tr');
      tr.setAttribute('id', data[i].id);
      tbodyPlaylists.append(tr);
      const tdTitle = document.createElement('td');
      tdTitle.textContent = data[i].title;
      tr.append(tdTitle);
  
      const tdDelete = document.createElement('td');
      if (data[i]["system_rank"] === 0) {
        tdDelete.innerHTML = svgDelete;
        tdDelete.addEventListener('click', async (e) => {
          let actualPlaylists = await deletePlaylist(url + `/playlists/${tr.getAttribute('id')}`, options);
          updatePlaylists(actualPlaylists);
        })
      }
      tr.append(tdDelete);
    }
  }
}

const deletePlaylist = async (url, options) => {
  options.method = 'DELETE';
  
  try {
    let response = await fetch(url, options);
    if(response.status === 400) {
      throw new Error(`Bad request!`);
    }
    let data = await response.json();
    return data;
    
  } catch(err) {
    console.log(err);
    return;
  }
}

const getPlaylists = async (url, options) => {
  options.method = 'GET';
  delete options.body;
  
  try {
    let response = await fetch(url, options);
    if(response.status === 404) {
      throw new Error(`Playlists not found!`);
    }
    let data = await response.json();
    return data;
    
  } catch(err) {
    console.log(err);
    return;
  }
}

const updateMediaPlayer = async () => {
  const dataPlaylists = await getPlaylists(url + '/playlists', options);
  updatePlaylists(dataPlaylists);
}

window.addEventListener('DOMContentLoaded', async (e) => {
  updateMediaPlayer();
})

newPlaylist.addEventListener('click', (e) => {
  modalNewplaylist.showModal();
});

closeNewPlaylist.addEventListener('click', (e) => {
  modalNewplaylist.close();
});