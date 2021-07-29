CREATE TABLE users (
	email varchar(80),
	username varchar(80),
	passhash varchar(512),
	accessLevel INTEGER DEFAULT 0 NOT NULL,
	queriesLeft INTEGER DEFAULT 0 NOT NULL
);