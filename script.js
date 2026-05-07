        let username = "";

        function show(x) {
            hide();
            document.querySelector(x).style.display = "block"; //select which one to show
            document.querySelector("#returnMenu").style.display = "block"; // show the return to menu button
            document.querySelector("#menu").style.display = "none"; // hide the menu
            if (x === 6) { // if the notes page is selected, show the notes page
                document.querySelector("#newPage").style.display = "inline-block"; // show the notes page
            }
        }
        function hide() { // hide all the views
            const views = document.querySelectorAll(".view"); // select all the views
            for (view of views) { // loop through the views
                view.style.display = "none"; // hide the view
            }
        }
        function showMenu() { // show the menu and
            hide(); // hide all the views
            document.querySelector("#returnMenu").style.display = "none"; // hide the return to menu button
            document.querySelector("#menu").style.display = "inline-block"; // show the menu
        }
        function ermLogin() { // show the login form and hide the register form
            document.querySelector("#register-form").style.display = "none"; // hide the register form
            document.querySelector("#login-form").style.display = "inline-block"; // show the login form
        }
        function ermRegister() { // show the register form and hide the login form
            document.querySelector("#register-form").style.display = "inline-block";// show the register form
            document.querySelector("#login-form").style.display = "none"; // hide the login form
        }
        function showMsgRegister(m) { // show a message on the register form
            const msg = document.getElementById("msg-register"); // select the message element
            msg.textContent = m; // set the text content to the message
        }
        function showMsgLogin(m) { // show a message on the login form
            const msg = document.getElementById("msg-login"); // select the message element
            msg.textContent = m; // set the text content to the message
        }
        function login(x, y) { // login the user with username x and password y
            const validUser = readUserFromStorage(x); // read the user from storage with the username
            if (validUser && validUser.password === y) { // if the user exists and the password is correct
                document.querySelector("#login-form").style.display = "none"; // hide the login form
                document.querySelector("#menu").style.display = "inline-block"; // show the menu
                localStorage.setItem("loginSuccessful", true); // set login successful to true in local storage
                localStorage.setItem("currentUser", document.querySelector("#user-login").value); // set the current user in local storage to the username
                username = document.querySelector("#user-login").value; // set the username variable to the username
                password = document.querySelector("#pass-login").value; // set the password variable to the password
            } else { // if the user doesn't exist or the password is incorrect
                showMsgLogin("invalid credentials"); // show an error message
            }
        }
        function register(u, p) { // register a new user with username u and password p
            if (u == "" || p == "") { // if the username or password is empty
                showMsgRegister("please fill out all fields"); // show an error message
                return; // stop the function from running
            }
            if (getUsersFromStorage().has(u)) { // if the username already exists in storage
                showMsgRegister("username already exists"); // show an error message
                return; // stop the function from running
            }
            currUser = createUser(u, p); // create the user and save it to storage
            document.querySelector("#register-form").style.display = "none"; // hide the register form
            document.querySelector("#user-login").value = u; // set the username input on the login form to the username
            document.querySelector("#pass-login").value = p; // set the password input on the login form to the password
            login(u, p); // login the user with the username and password
        }
        const form1 = document.getElementById("login-form"); // select the login form
        const form2 = document.getElementById("register-form"); // select the register form
        form1.addEventListener("submit", function (event) { // add an event listener to the login form for when it is submitted
            event.preventDefault(); // prevent the default form submission behavior
            const x = document.querySelector("#user-login").value; // get the username from the login form
            const y = document.querySelector("#pass-login").value; // get the password from the login form
            login(x, y); // log in the user with the username and password
        });
        form2.addEventListener("submit", function (event) { // add an event listener to the register form for when it is submitted
            event.preventDefault();// prevent the default form submission behavior

            let createdUsername = document.querySelector("#user-register").value; // get the username from the register form
            let createdPassword = document.querySelector("#pass-register").value; // get the password from the register form
            register(createdUsername, createdPassword); // register the user with the username and password
        });
        function innit() { // initiallizer function
            username = localStorage.getItem("currentUser") || ""; // set the username variable to the current user in local storage or an empty string if there is no current user

            if (getUsersFromStorage().size > 0) { // if there are users in storage
                if (localStorage.getItem("loginSuccessful")) { // if login successful is true in local storage
                    document.querySelector("#login-form").style.display = "none"; // hide the login form
                    document.querySelector("#menu").style.display = "inline-block"; // show the menu
                    document.querySelector("#register-form").style.display = "none"; // hide the register form
                }
                else { // if login successful is not true in local storage
                    document.querySelector("#login-form").style.display = "inline-block"; // show the login form
                    document.querySelector("#register-form").style.display = "none"; // hide the register form
                }
            }
            else { // if there are no users in storage
                document.querySelector("#register-form").style.display = "inline-block"; // show the register form
            }
        };
        function unregister() { // delete the user's account and all their data
            const users = getUsersFromStorage(); // get the users from storage
            localStorage.setItem("users", JSON.stringify(Array.from(users))); // save the users back to storage to make sure we have the most up to date version
            localStorage.removeItem("currentUser"); // remove the current user from local storage
            localStorage.removeItem("loginSuccessful"); // remove login successful from local storage
            username = ""; // set the username variable to an empty string
            document.querySelector("#menu").style.display = "none"; // hide the menu
            document.querySelector("#register-form").style.display = "inline-block"; // show the register form
        }
        function logout() { // log out the user and return to the login form
            showMsgLogin("logging out"); // show a message on the login form that says logging out
            localStorage.removeItem("loginSuccessful"); // remove login successful from local storage
            window.location.reload(); // reload the page to reset the state
        }
        let phash = window.location.hash; // get the hash from the URL
        function loadPage() { // load the page based on the hash in the URL
            console.log("LOADING PAGE", phash); // log the hash to the console for debugging purposes
            if (phash) { // if there is a hash in the URL, load the page
                if (phash[0] === "#") { // if the first character of the hash is a #, remove it and decode the rest of the hash to get the page name
                    phash = decodeURIComponent(phash.slice(1)); // remove the # and decode the rest of the hash to get the page name. Not sure why i need decodeURIComponent, but without it, the notes app doesn't work right. So dont touch this
                }
                let user = readUserFromStorage(username); // read the user from storage with the username
                let pagecontents = user.notes.get(phash); // get the page contents from the user's notes with the page name
                if (pagecontents === null || undefined) { // if the page contents is null or undefined, set it to an empty string
                    pagecontents = ""; // set the page contents to an empty string
                }
                let pageview = document.querySelector("#newPage"); // select the page view element
                if (localStorage.getItem("firstUser") == username) { // if the current user is the first user, show a welcome message instead of the page contents
                    pageview.innerHTML = pagecontents; // set the page view's inner HTML to the page contents
                    document.querySelector("#addLine").value = pagecontents; // set the add line input's value to the page contents
                    document.querySelector("#pagekey").value = phash; // set the page key input's value to the page name
                }
            }
        }

        function decideIfSavePage() { // save the page with the name in the page key input and the contents in the add line input
            let b = document.querySelector("#pagekey").value; // get the page name from the page key input
            let a = document.querySelector("#addLine").value; // get the page contents from the add line input
            if (!a) { // if the page contents is empty
                c = prompt("just confirming you want to do this, as saving a page with nothing on it will erase your page. Type yes if you do, no if you don't"); // ask the user if they are sure they want to save an empty page
                if (c == "yes") { // if the user types yes, save the empty page
                    savePage(a, b); // save the page with the name in the page key input and the contents in the add line input
                } else { // if the user doesn't type yes, don't save the empty page and return to the function
                    return; // return to the function without saving the empty page
                }
            }
            savePage(a, b); // save the page with the name in the page key input and the contents in the add line input
        }

        function savePage(a, b) {
            let user = readUserFromStorage(username); // read the user from storage with the username
            user.notes.set(b, a); // set the page contents in the user's notes with the page name as the key
            saveUser(user); // save the user back to storage
            document.querySelector("#newPage").innerHTML = a; // set the page view's inner HTML to the page contents
        }

        function diffPage() { // change the page view to the page with the name in the page key input
            let b = document.querySelector("#pagekey").value.replace("#", ""); // get the page name from the page key input and remove any # characters from it to prevent issues with the URL hash
            window.location.hash = b; // set the URL hash to the page name so that the page can be loaded when the URL is shared or bookmarked. This also triggers the loadPage function to load the page contents into the page view
            phash = b; // set the phash variable to the page name so that it can be used in the loadPage function to load the page contents into the page view
            let user = readUserFromStorage(username); // read the user from storage with the username
            let content = user.notes.get(b); // get the page contents from the user's notes with the page name as the key
            if (content === null || content === undefined) { // if the page contents is null or undefined, set it to an empty string
                content = ""; // set the page contents to an empty string
            }
            document.querySelector("#newPage").innerHTML = content; // set the page view's inner HTML to the page contents
            document.querySelector("#addLine").value = content; // set the add line input's value to the page contents so that it can be edited and saved again if needed
            loadPage(); // call the loadPage function to load the page contents into the page view. This is necessary to update the page view with the new page contents after changing the URL hash
        }

        function readUserFromStorage(user) { // self Explanitory
            const currUser = loadUser(user); // load the user from storage with the username
            if (!currUser) // if the user doesn't exist
                return null; // return null

            if (currUser.notes) { // if the user has notes
                currUser.notes = new Map(currUser.notes); // convert the user's notes from an array of key-value pairs back into a Map object so that it can be used to store and retrieve page contents with page names as keys
            } else { // if the user doesn't have notes
                currUser.notes = new Map(); // set the user's notes to an empty Map object so that it can be used to store and retrieve page contents with page names as keys
            }
            return currUser; // return the user object with the notes property as a Map object
        }
        function createUser(username, password) { // create a new user object with the given username and password, and an empty Map object for notes
            const user = {
                username: username,// set the username property to the given username
                password: password,// set the password property to the given password
                notes: new Map() // set the notes property to an empty Map object so that it can be used to store and retrieve page contents with page names as keys
            };

            saveUser(user); // save the user to storage so that it can be loaded and used later

            return user; // return the user object with the username, password, and notes properties
        }
        function getUsersFromStorage() { // self explanitory
            const parsedArray = JSON.parse(localStorage.getItem("users")); // get the users from storage and parse them from a JSON string into an array of key-value pairs
            return new Map(parsedArray); // convert the array of key-value pairs into a Map object
        }
        function loadUser(username) { // self Explanitory
            const storedUsers = getUsersFromStorage(); // get the users from storage as a Map object
            return storedUsers.get(username); // return the user object from the Map object with the given username as the key
        }
        function saveUser(user) { // self explanitory
            const userCopy = user; // create a copy of the user object
            let users = getUsersFromStorage();  // get the users from storage as a Map object
            userCopy.notes = Array.from(user.notes.entries()); // convert the user's notes from a Map object into an array of key-value pairs so that it can be saved to storage as a JSON string
            users.set(user.username, userCopy); // set the user object in the Map object with the username as the key and the user object as the value
            localStorage.setItem("users", JSON.stringify(Array.from(users))); // save the users back to storage as a JSON string by converting the Map object into an array of key-value pairs and then stringifying it
        }
        innit(); // call the initializer function to set up the initial state of the page based on local storage and the current user
        loadPage(); // I don't quite understand why this is necessary, but without it, the notes app dont work right. So dont touch this