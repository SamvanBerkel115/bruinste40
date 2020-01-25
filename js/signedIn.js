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
            },
            selectedSongs: async function() {
                let users = await bruin.rest.get.users();
                for (let i = 0; i < users.length; i++) {
                    if (localStorage.getItem('userName') == users[i].userName) {
                        users[i].selectedSongs = bruin.data.selectedSongs;
                    
                        bruin.rest.put.users(users);
                    }
                }
            }
        }
    },
    data: {
        songs: [],
        searchedSongs: [],
        selectedSongs: [],
        users: [],
        deleteClicks: 0,
        admin: false
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

                if (false) {
                    let spotifyFrame = document.createElement('iframe');
                    spotifyFrame.classList.add("songSpotifyFrame");
                    spotifyFrame.setAttribute("src", song.spotifyLink);
                    divSong.appendChild(spotifyFrame);
                }
    
                $(divSong).on('click touch', async function(evt) {
                    let divSong = this;

                    let alreadyInList = false;
                    let duplicateIndex = null;

                    for (let i = 0; i < bruin.data.selectedSongs.length; i++) {
                        if (bruin.data.selectedSongs[i].track == divSong.params.track) {
                            alreadyInList = true;
                            duplicateIndex = i;
                        }
                    }

                    if (alreadyInList) {
                        divSong.style.opacity = "1";
                        bruin.data.selectedSongs.splice(duplicateIndex, 1);

                        bruin.set.selectedSongs();
                    } else {
                        if (bruin.data.selectedSongs.length >= 20) {
                            return;
                        }

                        divSong.style.opacity = "0.5"

                        bruin.data.selectedSongs.push(divSong.params);

                        Id('divSelectedSongs').appendChild(bruin.create.song(divSong.params));
                    }

                    bruin.rest.put.selectedSongs();
                });

                // Set the selected songs from the current user.
                bruin.data.selectedSongs.forEach(function(selectedSong) {
                    if (selectedSong.track == song.track) {
                        divSong.style.opacity = "0.5";
                    }
                });
    
                Id('divSongs').appendChild(divSong);
            })
        },
        selectedSongs: function() {
            Id('divSelectedSongs').innerHTML = "";

            // Set the selected songs from the current user.
            bruin.data.selectedSongs.forEach(function(song) {
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

            let pTrack = document.createElement('p');
            pTrack.innerHTML = songObj.track;
            pTrack.classList.add('pTrack');
            divSong.appendChild(pTrack);

            let iconDelete = document.createElement('i');
            iconDelete.classList.add("fas");
            iconDelete.classList.add("fa-trash-alt");
            iconDelete.classList.add("btnDeleteSong");
            iconDelete.params = songObj;
            divSong.appendChild(iconDelete);

            $(iconDelete).on('click touch', async function(evt) {
                if (bruin.data.deleteClicks > 0) {
                    return;
                }
                bruin.data.deleteClicks++;

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

                setTimeout(function(){ 
                    bruin.data.deleteClicks = 0;
                 }, 200);
            });

            return divSong;
        }
    },
    calculateResults: function() {
        let results = [];
        bruin.data.users.forEach(function(user) {
            for (let i = 0; i < user.selectedSongs.length; i++) {
                var currentSong = user.selectedSongs[i];

                var found = false;
                var foundIndex = null;

                for(var j = 0; j < results.length; j++) {
                    if (results[j].song.track == currentSong.track) {
                        found = true;
                        foundIndex = j;
                        break;
                    }
                }

                var points = Math.ceil((20 - i) / 5);

                if (found) {
                    results[foundIndex].points += points;
                } else {
                    results.push({
                        song: currentSong,
                        points: points
                    })
                }
            }
        });

        results.sort(function(song1, song2) {
            if (song1.points < song2.points) {
                return -1;
            } else if (song1.points > song2.points) {
                return 1;
            } else {
                return 0;
            }
        })

        console.log(results);
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

        $('#btnOpenJouwBruine').on('click touch', function(evt) {
            Id('divJouwBruine').style.width = "100%";
            Id('divJouwBruine').style.padding = "30px";
            Id('divJouwBruine').dataset.hidden = false;

            Id('btnOpenJouwBruine').style.display = "none";
            Id('btnCloseJouwBruine').style.display = "inline-block";
        });

        $('#btnCloseJouwBruine').on('click touch', function(evt) {
            Id('divJouwBruine').style.width = "0";
            Id('divJouwBruine').style.padding = "0";
            Id('divJouwBruine').dataset.hidden = true;

            Id('btnOpenJouwBruine').style.display = "inline-block";
            Id('btnCloseJouwBruine').style.display = "none";
        });

        $("#divSelectedSongs").sortable({
            scroll : false,
            update: function(event, ui) {
                let listItems = Id('divSelectedSongs').childNodes;

                let selectedSongs = [];

                listItems.forEach(function(songDiv) {
                    selectedSongs.push(songDiv.params);
                });

                bruin.data.selectedSongs = selectedSongs;

                bruin.rest.put.selectedSongs();
            }
        })

        $("#divSelectedSongs").disableSelection();
        $("#divSelectedSongs").sortable("option", "axis", "y");
        $("#myContainer").sortable("option", "containment", Id('divJouwBruine'));

        bruin.data.songs = bruin.data.searchedSongs = await bruin.rest.get.songs();
        bruin.data.users = await bruin.rest.get.users();

        let userName = localStorage.getItem("userName");

        // Find the current user.
        let currentUser = bruin.data.users.find(function(user) {
            if (user.userName == userName) {
                return true;
            }
            if (user.userName == "Sam_Berkel") {
                bruin.data.admin = true;
            }
        })

        // Point the user to the register page of the username cant be found.
        if (!currentUser) {
            localStorage.removeItem("userName");
            window.location.href = "index.html";
        }
                
        bruin.data.selectedSongs = currentUser.selectedSongs;

        bruin.set.songs();
        bruin.set.selectedSongs();

        let requiredHeight = parseInt(Id('numberList').offsetHeight, 10) + 50;
        Id('divJouwBruine').style.height = requiredHeight + 'px';
    }
}

var Id = function(id) {
    return document.getElementById(id);
}

$( document ).ready(function() {
    bruin.init();
});