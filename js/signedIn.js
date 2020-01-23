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
        users: []
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
    
                $(divSong).on('click', async function(evt) {
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

                    let users = await bruin.rest.get.users();
                    for (let i = 0; i < users.length; i++) {
                        if (localStorage.getItem('userName') == users[i].userName) {
                            users[i].selectedSongs = bruin.data.selectedSongs;
                        
                            bruin.rest.put.users(users);
                        }
                    }
    
                    Id('divSelectedSongs').appendChild(bruin.create.song(divSong.params));
                });
    
                Id('divSongs').appendChild(divSong);
            })
        },
        selectedSongs: function() {
            let userName = localStorage.getItem("userName");

            // Find the current user.
            let currentUser = bruin.data.users.find(function(user) {
                if (user.userName == userName) {
                    return true;
                }
            })

            // Point the user to the register page of the username cant be found.
            if (!currentUser) {
                localStorage.removeItem("userName");
                window.location.href = "index.html";
            }

            // Set the selected songs from the current user.
            bruin.data.selectedSongs = currentUser.selectedSongs;
            currentUser.selectedSongs.forEach(function(song) {
                let songDiv = bruin.create.song(song);

                Id('divSelectedSongs').appendChild(songDiv);

                // Set the opacity of the selected songs in the complete song list.
                let childNodes = Id('divSongs').childNodes;
                for (let i = 0; i < childNodes.length; i++) {
                    if (childNodes[i].classList.contains("divSong")) {
                        if (childNodes[i].params.track == song.track) {
                            childNodes[i].style.opacity = "0.5";
                        }
                    }
                }
            });
        }
    },
    create: {
        song: function(songObj) {
            let divSong = document.createElement('li');
            divSong.classList.add('divSelectedSong');
            divSong.classList.add('ui-state-default"');
            divSong.params = songObj;

            let pTrack = document.createElement('span');
            let trackText = songObj.track;
            if (trackText.length > 25) {
                trackText = trackText.substring(0, 25) + "..."
            }
            pTrack.innerHTML = trackText;
            pTrack.classList.add('pTrack');
            divSong.appendChild(pTrack);

            let iconDelete = document.createElement('i');
            iconDelete.classList.add("fas");
            iconDelete.classList.add("fa-trash-alt");
            iconDelete.classList.add("btnDeleteSong");
            iconDelete.params = songObj;
            divSong.appendChild(iconDelete);

            $(iconDelete).on('click touchend', async function(evt) {
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

                // Send the data to the server.
                let users = await bruin.rest.get.users();
                for (let i = 0; i < users.length; i++) {
                    if (localStorage.getItem('userName') == users[i].userName) {
                        users[i].selectedSongs = bruin.data.selectedSongs;
                    
                        bruin.rest.put.users(users);
                    }
                }
            });

            return divSong;
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

        $('#btnOpenJouwBruine').on('click', function(evt) {
            Id('divJouwBruine').style.width = "100%";
            Id('divJouwBruine').style.padding = "30px";
            Id('divJouwBruine').dataset.hidden = false;

            Id('btnOpenJouwBruine').style.display = "none";
            Id('btnCloseJouwBruine').style.display = "inline-block";
        });

        $('#btnCloseJouwBruine').on('click', function(evt) {
            Id('divJouwBruine').style.width = "0";
            Id('divJouwBruine').style.padding = "0";
            Id('divJouwBruine').dataset.hidden = true;

            Id('btnOpenJouwBruine').style.display = "inline-block";
            Id('btnCloseJouwBruine').style.display = "none";
        });

        $("#divSelectedSongs").sortable();
        $("#divSelectedSongs").disableSelection();

        bruin.data.songs = bruin.data.searchedSongs = await bruin.rest.get.songs();
        bruin.data.users = await bruin.rest.get.users();

        bruin.set.songs();
        bruin.set.selectedSongs();
    }
}

var Id = function(id) {
    return document.getElementById(id);
}

$( document ).ready(function() {
    bruin.init();
});