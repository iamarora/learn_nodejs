-- Setup a database, user and grant access to the user for the database. Run this as postgresql user
CREATE database learn_nodejs;
CREATE USER learn_nodejs WITH encrypted password 'learn_nodejs';
GRANT ALL privileges ON database learn_nodejs TO learn_nodejs;

-- Create the users table, run the below commands using the new user you created. 
CREATE TABLE users(
	id INTEGER PRIMARY KEY,
	name varchar(255),
	email varchar(255),
	phone varchar(255)
);

CREATE TABLE posts(
        id INTEGER PRIMARY KEY,
        title text,
        body text,
        user_id INTEGER REFERENCES users(id)
);

