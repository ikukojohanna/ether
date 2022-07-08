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
// --------------------------------------------------------------------------------------------------------------------------------

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
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
