// --------------------------------------------------------------------------------------------------------------------------------
/////------------------------------------------------------ SET UP ----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------

// set up express server
const express = require("express");
//create instance of express
const app = express();

const db = require("./db");

const bcrypt = require("./bcrypt");

//middleware to impletment the tamper proof cookie session
const cookieSession = require("cookie-session");

const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;

const compression = require("compression");

const path = require("path");
const cryptoRandomString = require("crypto-random-string");

const { sendEmail } = require("./ses");
const s3 = require("./s3");
//multer interprets form requests that are not of type urlencoded but multipartFormDatan (mostly used for file uploads)
const multer = require("multer");

const uidSafe = require("uid-safe");

//----------------------------------------------------------SOCKET IO SETUP--------------------------------------------------------------------

//create server... pass app to that server
const server = require("http").Server(app);

const io = require("socket.io")(server, {
    //we have to say on which url we allow communication: everyhting that starts with.... localhost 3000
    //should you be deploying this... need to change this url. because we need to allow external communication!
    //CHANGE REQUEST HEADERS
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

// we need to funnel userID in socket to know who is on the page... tell io to use cookiesession middleware

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

//----------------------------------------------------------Multer Setup--------------------------------------------------------------------

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename(req, file, callback) {
        //create random name 24 characters long
        uidSafe(24).then((randomString) => {
            console.log("file: ", file);
            // extname method to get original extension
            const extname = path.extname(file.originalname);
            callback(null, `${randomString}${extname}`);
        });
    },
});

//creating uploader funtionality
const uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});

//------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------  MIDDLEWARE -------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------

app.use(compression()); // will compress everything it can
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

//need cookie session middleware..
//add cookie when user successfully registers... etc etc

//---------------------------------------- COOKIE SESSION SET UP ----------------------------------

const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    //-------- prevent Cross-site request forgeries
    sameSite: true,
});
app.use(cookieSessionMiddleware);

// -----------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------ROUTES--------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------

//fetch.start

app.get("/user/id.json", (req, res) => {
    res.json({
        userId: req.session.userId,
    });
});
// -----------------------------------------------------------REGISTER---------------------------------------------------------------------

app.post("/register", (req, res) => {
    console.log("req.body", req.body);
    bcrypt
        .hash(req.body.password)
        .then((hash) => {
            console.log(hash);
            db.addUser(req.body.first, req.body.last, req.body.email, hash)
                .then((results) => {
                    console.log(results);
                    req.session.userId = results.rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({
                        success: false,
                        error: true,
                    });
                });
        })
        .catch((err) => {
            console.log("bcrypt went wrong", err);
            res.json({
                success: false,
                error: true,
            });
        });
});

// --------------------------------------------- LOGIN ---------------------------------------------------

app.post("/login", (req, res) => {
    db.findUser(req.body.email)
        .then((result) => {
            console.log("findUser result/LOGIN", result);
            return bcrypt
                .compare(req.body.password, result.rows[0].password)
                .then(function (isCorrect) {
                    if (isCorrect) {
                        console.log("correct! result,rows[0]", result.rows[0]);
                        req.session.userId = result.rows[0].id;
                        res.json({ success: true });
                    } else {
                        console.log("WRONG!");
                        res.json({
                            success: false,
                            error: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.json({
                        success: false,
                        error: true,
                    });
                });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false,
                error: true,
            });
        });
});

// --------------------------------------------- Reset Password ---------------------------------------------------
app.post("/password/reset/start", (req, res) => {
    // console.log("email sends here", req.body.email);

    // HERE CHECK THAT EMAIL IS IN THE USERS TABLE... NOT NULL??

    db.findUser(req.body.email)
        .then((result) => {
            //console.log("findUser result/RESET PASSWORD", result);

            if (result.rowCount === 0) {
                res.json({
                    success: false,
                    error: true,
                });
            } else {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                // console.log("secretCode", secretCode);
                // console.log("req.body.email", req.body.email);

                db.storeCode(req.body.email, secretCode)
                    .then(
                        (result) =>
                            console.log(
                                "email and code successfully stored",
                                result
                            ),
                        sendEmail(req.body.email, secretCode, "hello"),
                        res.json({
                            success: true,
                            error: true,
                        })
                    )
                    .catch((err) => {
                        console.log(err);
                        res.json({
                            success: false,
                            error: true,
                        });
                    });
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false,
                error: true,
            });
        });
});
app.post("/password/reset/verify", (req, res) => {
    //console.log("reset code ", req.body.code);
    //console.log(" new passsword POST", req.body.newPassword);
    //  console.log(" new passswordEMAIL", req.body.email);
    //here do error
    db.compareCodes(req.body.email).then((result) => {
        // console.log("result from compareCodes", result);
        //filter through result.rows to see if contains the code
        // if(result.rows)
        console.log("code1", result.rows[result.rows.length - 1]);
        console.log("code2", req.body.code);
        if (result.rows[result.rows.length - 1].secret_code === req.body.code) {
            //here we hash passwrod and send it to database
            console.log("the codes MATCH");
            bcrypt
                .hash(req.body.newPassword)
                .then((hash) => {
                    console.log(hash);
                    db.updatePassword(hash, req.body.email)
                        .then((results) => {
                            console.log(
                                "reuslts from password update",
                                results
                            );
                            // req.session.userId = results.rows[0].id;
                            // res.redirect("/profile");
                            req.session.userId = results.rows[0].id;

                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.json({
                                success: false,
                                error: true,
                            });
                        });
                })
                .catch((err) => {
                    console.log("bcrypt went wrong", err);
                    res.json({
                        success: false,
                        error: true,
                    });
                });
        } else {
            res.json({
                success: false,
                error: true,
            });
        }
    });
    // here query and compare code and emails
});
// --------------------------------------------- Get User data ---------------------------------------------------

app.get("/user", (req, res) => {
    db.getUserData(req.session.userId)
        .then((results) => {
            const userData = results.rows[0];
            res.json({
                success: true,
                userData,
            });
        })
        .catch((err) => {
            console.log("error while getting user data", err);
            res.json({
                success: false,
                error: true,
            });
        });
});

// ----------------------------------------------------ImageUpload----------------------------------------------------------------------------

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    console.log("IN UPLOAD");
    console.log("req.body: ", req.body);
    console.log("req.file", req.file);
    console.log("req.file.filename", req.file.filename);
    const url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;
    console.log("url", url);

    db.uploadImg(url, req.session.userId)
        .then((result) => {
            console.log("result after upload image", result.rows[0]);
            res.json({
                sucess: true,
                uploadedImg: result.rows[0],
            });
        })
        .catch((err) => {
            console.log("error in POST request/upload", err);
        });
});

// ----------------------------------------------------UPDATE BIO----------------------------------------------------------------------------

app.post("/updateBio", (req, res) => {
    console.log("body from post updateBIO", req.body.draftBio);
    console.log("req.session.userId", req.session.userId);

    db.updateBio(req.body.draftBio, req.session.userId)
        .then((result) => {
            console.log("reusult updateBIO query", result.rows[0]);
            res.json({
                updatedBio: result.rows[0],
            });
        })
        .catch((err) => {
            console.log("error in post request for updateBio", err);
        });
    /*  if (req.body) {
        db.updateBio(req.body.bio, req.session.userId)
            .then((result) => {
                res.json({
                    success: true,
                    payload: result.rows[0],
                });
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    } else {
        console.log("error in updting user's bio ", err);
        res.json({
            success: false,
            error: true,
        });
    }*/
});

// ----------------------------------------------------find recent users----------------------------------------------------------------------------

app.get("/users/", (req, res) => {
    // console.log("req.query.findUsers", req.query.findUsers);
    if (req.query.findUsers) {
        db.matchUsers(req.query.findUsers).then((result) => {
            // console.log("result.rows", result.rows);
            const findUsers = result.rows;
            res.json(findUsers);
        });
    } else {
        db.getRecentUsers().then((result) => {
            const getOtherUsers = result.rows;
            console.log("getrecentusers result:", getOtherUsers);
            res.json(getOtherUsers);
        });
    }
});

// ---------------------------------------------------- other profile----------------------------------------------------------------------------
app.get("/api/user/:id", (req, res) => {
    // console.log("req.params.id", req.params.id);
    // console.log("req.session.userId", req.session.userId);

    if (req.params.id == req.session.userId) {
        return res.json({
            currentUserId: req.session.userId,
        });
    }

    db.getUserData(req.params.id)
        .then((result) => {
            if (result.rows[0]) {
                res.json(result.rows[0]);
            } else {
                console.log("no user match");
                res.json({ noMatch: true });
            }
        })
        .catch((err) => {
            console.log("error in get request otherprofile: ", err);
        });
});

// ----------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------- Friend Button ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------- get relationship infos:
app.get("/api/relationship/:id", (req, res) => {
    // console.log("req.params.id", req.params.id);
    //  console.log("req.session.userId", req.session.userId);

    db.getFriendship(req.session.userId, req.params.id)
        .then((result) => {
            console.log("result.rows", result.rows);
            if (result.rows[0]) {
                res.json(result.rows[0]);
            } else {
                res.json({ notFriends: true });
            }
        })
        .catch((err) => {
            console.log("error in get request friend button", err);
        });
});

//------------------------------------------------------------------------------- make,accept,cancel friendship:
app.post("/api/friendButton/:id", (req, res) => {
    // console.log("req.params.id", req.params.id);
    //console.log("req.session.userId", req.session.userId);
    //console.log("req.body.buttonText", req.body.buttonText);

    if (req.body.buttonText === "Make Friend Request") {
        // console.log("make freind request");
        db.requestFriendship(req.session.userId, req.params.id)
            .then((result) => {
                //send back result so we can change button text accordingly
                res.json({
                    resultRequest: result.rows[0],
                    buttonText: "Cancel friend request",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else if (req.body.buttonText === "Accept friend request") {
        console.log("Accept friend request");
        db.acceptFriendship(req.session.userId, req.params.id)
            .then((result) => {
                // console.log("result.rows", result.rows);
                //send back result so we can change button text accordingly
                res.json({
                    resultAccept: result.rows[0],
                    buttonText: "End Friendship",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else if (
        req.body.buttonText === "Cancel friend request" ||
        req.body.buttonText === "End Friendship"
    ) {
        console.log("Cancel friend request");
        db.cancelFriendship(req.session.userId, req.params.id)
            .then((result) => {
                // console.log("result.rows", result.rows);
                //send back result so we can change button text accordingly
                res.json({
                    resultCancel: result.rows[0],
                    buttonText: "Make Friend Request",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
});
// ----------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------- get friends and wannabees ----------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------

app.get("/friendswannabees.json", (req, res) => {
    console.log("app get friends wannabees launched");
    db.getFriendsWannabees(req.session.userId)
        .then((result) => {
            //  console.log("result.rows", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error while getting friends and wannabees", err);
        });
});

// ----------------------------------------------------Logout----------------------------------------------------------------------------

app.get("/logout", (req, res) => {
    req.session = null;
    res.json({ success: true });
});
/*
app.get("/logout", (req, res) => {
    req.session = null;
    location.replace("/");
});*/

// server.js
app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

//you wont ever open 3001.. server runs on 3001 but all of our CLIENT SIDE is on 3000
//when we make requests fro client side we still need to connect them to server
//theres lines of code that makes sure  requests are sent to server
//but we will NEVEr open 3001

//SERVERbecause sockets can't use an express server we need to have the lisstening to be done by a node server.... not app.listen but server.listen
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

// ---------------------------------------------------------- SOCKET COMMUNICATION -----------

const users = {};

//do table instead?
const messages = {
    general: ["hello000", "hi", "whatever"],
    arakis: ["hellssssso", "hi", "whatever"],
    solaris: ["hellaaaao", "hi", "whatever"],
};

io.on("connection", function (socket) {
    //below only exists when cookieseesion is passed to io
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;
    console.log(
        `user with Id: ${userId}and socket.id ${socket.id}, just connected`
    );

    //---- conect ----
    socket.join("general");
    socket.emit("joined", { room: "general" });

    console.log("general has been joined on connection");

    db.getMessages("general")
        .then((result) => {
            console.log("result.rows in getMessages", result.rows);
            const messages = result.rows;
            socket.emit("last-10-messages", {
                messages: messages,
            });
        })
        .catch((err) => {
            console.log(err);
        });

    //ONE BIG TABLE? DB QUERIES TO GET SPECFIC ONES
    //FOR DM... ADD RECIPIENT COLUMN... ORR IS ROOM CO:UM THE RECIPIEN?

    //users[userId] = users[userId] || [];
    //same line as above but shorter:
    users[userId] ||= [];

    users[userId] = [...users[userId], socket.id];

    //console.log("users", users);

    (async () => {
        try {
            const online = Object.keys(users);
            const result = await db.getOnlineUsers(online);
            const onlineUsers = result.rows;
            io.emit("online-users", onlineUsers);
        } catch (err) {
            console.log("error while getting online users", err);
        }
    })();

    //---- rooms ----

    socket.on("join-room", (roomName) => {
        socket.join(roomName);

        //which user joined which room
        console.log(
            `user with Id: ${userId}and socket.id ${socket.id} room joined`,
            roomName
        );

        db.getMessages(roomName)
            .then((result) => {
                // console.log("result.rows in getMessages", result.rows);
                const messages = result.rows;
                socket.emit("last-10-messages", {
                    messages: messages,
                });
            })
            .catch((err) => {
                console.log(err);
            });

        //db query to add user to db???? or to get past messages from chat?

        //cb(messages[roomName]); //this callback gives you back the past messages of the room you just joined
        //with callback your sever side code in evoking function that was defined client side

        const messageObjectRoom = {
            messages: messages[roomName],
            user: userId,
            room: roomName,
        };
        socket.emit("joined", messageObjectRoom);

        //problem with line above is:
        //in my server side code i have to come up with new event name
        //in client side i need to set up new event listener

        console.log("socket.rooms", socket.rooms);
        socket.to(roomName).emit(`Thanks for joingin! ${roomName}`);
    });

    // make a socket..leave option?

    socket.on(
        "send message",
        //to is either room name or socket id
        //sending message only to room or socket id depending on what your passing in
        ({ content, to, sender, chatName, isChannel }) => {
            //message to a ROOM
            //room name will be the same for every dingle user
            if (isChannel) {
                const payload = {
                    content,
                    chatName,
                    sender,
                };

                socket, to(to).emit("new message", payload);
            }
            //DM to a user
            //private  "chat" will be called different for both users... the name of the other person
            else {
                const payload = {
                    content,
                    chatName: sender,
                    sender,
                };
                socket, to(to).emit("new message", payload);
            }
            //checking that chatName(room) exists
            if (messages[chatName]) {
                messages[chatName].push({
                    sender,
                    content, //gettin messages retroactively if joining chat alter
                });
            }
        }
    );

    //---- disconnect ----
    socket.on("disconnecting", () => {
        console.log("SET WHEN DISCONNECTING", socket.rooms); // the Set contains at least the socket ID
    });

    socket.on("disconnect", () => {
        console.log(`socket with socket.id ${socket.id} disconnected`);

        users[userId] = users[userId].filter((element) => element != socket.id);
        users[userId] = users[userId].filter((element) => element != []);

        if (!users[userId].length) {
            //console.log("it's an empty array");
            delete users[userId];
        }

        (async () => {
            try {
                const online = Object.keys(users);
                const result = await db.getOnlineUsers(online);
                const onlineUsers = result.rows;
                io.emit("online-users", onlineUsers);

                /*
            .then((result) => {
                  
                    console.log("onlineUsers:\t", online);
                    // console.log("result from getONlineusers", result.rows);
                    const onlineUsers = result.rows;
                    io.emit("online-users", onlineUsers);

                
            })
            .catch((err) => {
                console.log("error while getting online users", err);
            });*/
            } catch (err) {
                console.log("error while getting online users", err);
            }
        })();

        console.log("users after deletion", users);
    });

    socket.on("new-message", (newMsg) => {
        console.log("received a new msg from client", newMsg);
        //first we want to know who sent message
        console.log("author of message was user with id:", userId);

        console.log("received a new msg from client ROOM", newMsg.room);
        console.log("received a new msg from client MESSAGE", newMsg.message);

        //2nd add this msg to chats table
        db.addMessage(userId, newMsg.room, newMsg.message)
            .then((result) => {
                console.log("result.rows", result.rows);
                const resultAddMessage = result.rows[0];
                console.log("resultAddMessafe", resultAddMessage);

                //3 want to retrieve user infos about the author
                db.getUserData(userId)
                    .then((result) => {
                        console.log("result.rows", result.rows);
                        //4 compose message object that contains user info and message

                        const messageObject = {
                            first: result.rows[0].first,
                            last: result.rows[0].last,
                            imageurl: result.rows[0].imageurl,
                            message: resultAddMessage.message,
                            id: resultAddMessage.id,
                            user_id: resultAddMessage.userId,
                        };
                        // 5 send back to all connect sockets, that there is a new message
                        console.log("messageObject", messageObject);
                        io.emit("add-new-message", messageObject);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })

            .catch((err) => {
                console.log(err);
            });
    });
});

//---------------------------  SOCKET ROOMS!
