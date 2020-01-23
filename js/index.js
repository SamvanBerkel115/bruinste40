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
        users: []
    },
    clear: function() {
        Id('tbFirstName').value = "",
        Id('tbLastName').value = "",
        Id('tbUserName').value = "",
        Id('tbPassword').value = ""
    },
    init: async function() {
        if (localStorage.getItem('userName')) {
            window.location.href = "signedIn.html";
        }

        Id('btnJoin').onclick = async function() {
            let newUserObj = {
                firstName: Id('tbFirstName').value,
                lastName: Id('tbLastName').value,
                userName: Id('tbUserName').value,
                password: Id('tbPassword').value,
                selectedSongs: []
            }

            const users = await bruin.rest.get.users();

            let duplicateUsername = false;

            users.forEach(function(user) {
                if (user.userName == newUserObj.userName) {
                    duplicateUsername = true;
                }
            })

            if (duplicateUsername) {
                return;
            }

            users.push(newUserObj);
            await bruin.rest.put.users(users);

            bruin.clear();

            localStorage.setItem('userName', newUserObj.userName);
            window.location.href = "signedIn.html";
        }

        Id('btnSignIn').onclick = async function() {
            let userName = Id('tbSignInUserName').value;
            let password = Id('tbSignInPassword').value;
            const users = await bruin.rest.get.users();

            let correctPaswrd = false;

            for (let i = 0; i < users.length; i++) {
                if (users[i].userName == userName) {
                    if (users[i].password == password) {
                        correctPaswrd = true;
                        break;
                    }
                }
            }

            if (correctPaswrd) {
                bruin.clear();

                localStorage.setItem('userName', userName);
                window.location.href = "signedIn.html";
            }
        }

        Id('btnAlreadyAccount').onclick = async function() {
            Id('divSignIn').style.display = "block";
            Id('divRegister').style.display = "none";
        }

        Id('btnNoAccountYet').onclick = async function() {
            Id('divSignIn').style.display = "none";
            Id('divRegister').style.display = "block";
        }

        bruin.data.songs = await bruin.rest.get.songs();
    }
}

var Id = function(id) {
    return document.getElementById(id);
}

$( document ).ready(function() {
    bruin.init();
});