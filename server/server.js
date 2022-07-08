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
