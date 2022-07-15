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
app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        //-------- prevent Cross-site request forgeries
        sameSite: true,
    })
);

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
                    // res.redirect("/profile");
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

// ----------------------------------------------------search users----------------------------------------------------------------------------
/*
app.get("/users/:search", (req, res) => {
    console.log("req.params", req.params);
    db.matchUsers(req.param.search).then((result) => {
        const findUsers = result.rows;
        res.json(findUsers);
    });
});*/

//res.render only works with express handlebars
//res.json is what u use when u work with frameworks
//here is where server only becomes middleman between our app and the database

// we are telling multer:
//when a form is being made...
//have a look if there is a image with name image. if yes store in uploads directory

// ----------------------------------------------------Logout----------------------------------------------------------------------------

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/"); //
});

// server.js
app.get("/user/id.json", function (req, res) {
    //for now bled out but we will use later.
    /* res.json({
        userId: req.session.userId, // this is going to be cookie.. sending back to react START.js
    });*/

    res.json({
        userId: req.session.userId, // if it was number... logo shows
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

//you wont ever open 3001.. server runs on 3001 but all of our CLIENT SIDE is on 3000
//when we make requests fro client side we still need to connect them to server
//theres lines of code that makes sure  requests are sent to server
//but we will NEVEr open 3001

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
