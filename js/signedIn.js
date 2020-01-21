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
            }
        }
    },
    data: {
        songs: [],
        users: [],
        chosen: []
    },
    clear: function() {
    },
    init: async function() {
        bruin.data.songs = await bruin.rest.get.songs();

        bruin.data.songs.forEach(function(song) {
            let divSong = document.createElement('div');
            divSong.classList.add('divSong');

            let pTrack = document.createElement('p');
            pTrack.innerHTML = song.track;
            pTrack.classList.add('pTrack');
            divSong.appendChild(pTrack);

            let pArtist = document.createElement('p');
            pArtist.innerHTML = song.artist;
            pArtist.classList.add('pArtist');
            divSong.appendChild(pArtist);

            divSong.onclick = function(evt) {
                let songDiv = this.cloneNode(true);

                Id('divSelection').appendChild(songDiv);
            }

            Id('divSongs').appendChild(divSong);
        })
    }
}

var Id = function(id) {
    return document.getElementById(id);
}

$( document ).ready(function() {
    bruin.init();
});