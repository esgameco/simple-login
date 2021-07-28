CREATE TABLE users (
	email varchar(80),
	username varchar(80),
	passhash varchar(512)
);

INSERT INTO users VALUES ('test@gmail.com', 'user', 'pass');