DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS codes;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS messages;



   CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL CHECK (first != ''),
    last VARCHAR NOT NULL CHECK (last != ''),
    email VARCHAR NOT NULL CHECK (email !='') UNIQUE, 
    password VARCHAR NOT NULL CHECK (password !='')
    imageUrl TEXT,
   bio TEXT,
   );

ALTER TABLE users 
ADD imageUrl TEXT;

ALTER TABLE users 
ADD bio TEXT;

   CREATE TABLE codes ( 
      id SERIAL PRIMARY KEY,
      user_email VARCHAR REFERENCES users(email),
      secret_code VARCHAR NOT NULL ,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );


        
      CREATE TABLE friendships(
      id SERIAL PRIMARY KEY,
      sender_id INT REFERENCES users(id) NOT NULL,
      recipient_id INT REFERENCES users(id) NOT NULL,
      accepted BOOLEAN DEFAULT false
  );

 CREATE TABLE messages (
   id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id) NOT NULL,
   message TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 

   );


INSERT INTO messages (user_id, message) 
 VALUES (68, 'Hallo lisa');