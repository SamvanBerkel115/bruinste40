if (!window.bruin) var bruin = {
    rest: {
        get: {
            songs: function() {
                let result = $.ajax({
                    url: "https://api.myjson.com/bins/iruli",
                    type:"GET",
                    contentType:"application/json; charset=utf-8",
                    dataType:"json",
                    success: function(data, textStatus, jqXHR){
                
                    }
                });

                return result;
            },
            users: function() {
                let result = $.ajax({
                    url: "https://api.myjson.com/bins/zw28m",
                    type:"GET",
                    contentType:"application/json; charset=utf-8",
                    dataType:"json",
                    success: function(data, textStatus, jqXHR){
                
                    }
                });

                return result;
            }
        },
        put: {
            users: function(users) {
                let result = $.ajax({
                    url: "https://api.myjson.com/bins/zw28m",
                    type:"PUT",
                    data: JSON.stringify(users),
                    contentType:"application/json; charset=utf-8",
                    dataType:"json",
                    success: function(data, textStatus, jqXHR){
                
                    }
                });

                return result;
            },
            songs: function(songs) {
                let result = $.ajax({
                    url: "https://api.myjson.com/bins/iruli",
                    type:"PUT",
                    data: JSON.stringify(songs),
                    contentType:"application/json; charset=utf-8",
                    dataType:"json",
                    success: function(data, textStatus, jqXHR){
                
                    }
                });

                return result;
            }
        }
    },
    data: {
        songs: [],
        searchedSongs: [],
        selectedSongs: [],
        users: [],
        chosen: []
    },
    set: {
        songs: function() {
            Id('divSongs').innerHTML = "";

            bruin.data.searchedSongs.forEach(function(song) {
                let divSong = document.createElement('div');
                divSong.classList.add('divSong');
                divSong.params = song;
    
                let pTrack = document.createElement('p');
                pTrack.innerHTML = song.track;
                pTrack.classList.add('pTrack');
                divSong.appendChild(pTrack);
    
                let pArtist = document.createElement('p');
                pArtist.innerHTML = song.artist;
                pArtist.classList.add('pArtist');
                divSong.appendChild(pArtist);
    
                divSong.onclick = function(evt) {
                    let divSong = this;

                    if (bruin.data.selectedSongs.length >= 10) {
                        return;
                    }

                    for (let i = 0; i < bruin.data.selectedSongs.length; i++) {
                        if (bruin.data.selectedSongs[i].track == divSong.params.track) {
                            return;
                        }
                    }

                    divSong.style.opacity = "0.5"

                    bruin.data.selectedSongs.push(divSong.params);

                    let divSelectedSong = document.createElement('li');
                    divSelectedSong.classList.add('divSelectedSong');
                    divSelectedSong.classList.add('ui-state-default"');
                    divSelectedSong.params = divSong.params;

                    let pTrack = document.createElement('span');
                    pTrack.innerHTML = divSong.params.track;
                    pTrack.classList.add('pTrack');
                    divSelectedSong.appendChild(pTrack);

                    let iconDelete = document.createElement('i');
                    iconDelete.classList.add("fas");
                    iconDelete.classList.add("fa-trash-alt");
                    iconDelete.classList.add("btnDeleteSong");
                    iconDelete.params = divSong.params;
                    divSelectedSong.appendChild(iconDelete);

                    iconDelete.onclick = function(evt) {
                        let btn = this;

                        // Remove the song from the selected songs data.
                        bruin.data.selectedSongs = bruin.data.selectedSongs.filter(function(song) {
                            if (song.track == btn.params.track) {
                                return false;
                            } else {
                                return true;
                            }
                        })

                        // Remove the div from the selected list.
                        let songDiv = btn.parentElement;
                        songDiv.parentElement.removeChild(songDiv);

                        // Set the opacity back in the songs list.
                        let childNodes = Id('divSongs').childNodes;

                        for (let i = 0; i < childNodes.length; i++) {
                            if (childNodes[i].classList.contains("divSong")) {
                                if (childNodes[i].params.track == btn.params.track) {
                                    childNodes[i].style.opacity = "1";
                                }
                            }
                        }
                    }
    
                    Id('divSelectedSongs').appendChild(divSelectedSong);
                }
    
                Id('divSongs').appendChild(divSong);
            })
        }
    },
    clear: function() {
    },
    init: async function() {
        Id('tbSearchBar').oninput = function(evt) {
            let text = this.value;

            let terms = text.split(" ").filter(function(term) {
                
                if (term == "") {
                    return false;
                } else if (term.length < 2) {
                    return false;
                } else {
                    return true;
                }
            });

            if (terms.length == 0) {
                bruin.data.searchedSongs = bruin.data.songs;
            } else {
                bruin.data.searchedSongs = bruin.data.songs.filter(function(song) {
                    let matched = false
                    
                    terms.forEach(function(term) {
                        if (song.track.toLowerCase().includes(term.toLowerCase())) {
                            matched = true;
                        }
    
                        if (song.artist.toLowerCase().includes(term.toLowerCase())) {
                            matched = true;
                        }
                    })
    
                    if (matched) {
                        return true;
                    } else {
                        return false;
                    }
                    
                })
            }

            bruin.set.songs();
        }

        $("#divSelectedSongs").sortable();
        $("#divSelectedSongs").disableSelection();

        bruin.data.songs = bruin.data.searchedSongs = await bruin.rest.get.songs();
        bruin.set.songs();
    }
}

var Id = function(id) {
    return document.getElementById(id);
}

$( document ).ready(function() {
    bruin.init();
});