//create function that does insert,,,
//nothing in the back end changes
//HERE  DO INSERT  of input INTO database TABLE
// AD ADD COOKIE TO BROWSER USERID
const spicedPg = require("spiced-pg");
const database = "social-network";
//when doing db queries we need to say WHO is doing them
const username = "postgres";
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

console.log("[db] connecting to:", database);
//------------------------------------------------- Register-------------------------------------------------

module.exports.addUser = (firstName, lastName, email, password) => {
    //return db.query;

    const q = `INSERT INTO users (first, last, email, password) 
        VALUES ($1, $2, $3, $4)
        RETURNING id;`;
    const param = [firstName, lastName, email, password];
    return db.query(q, param);
};

//---------------------------------------------------------LOGIN---------------------------------------------

module.exports.findUser = (email) => {
    const q = `SELECT * FROM users
 WHERE email= $1`;
    const param = [email];
    return db.query(q, param);
};
