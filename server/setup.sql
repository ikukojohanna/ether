DROP TABLE IF EXISTS users;

   CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL CHECK (first != ''),
    last VARCHAR NOT NULL CHECK (last != ''),
    email VARCHAR NOT NULL CHECK (email !='') UNIQUE, 
    password VARCHAR NOT NULL CHECK (password !='')

   );

DROP TABLE IF EXISTS codes;
   CREATE TABLE codes ( 
      id SERIAL PRIMARY KEY,
      user_email VARCHAR REFERENCES users(email),
      secret_code VARCHAR NOT NULL ,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
