DROP TABLE IF EXISTS clubs CASCADE;

CREATE TABLE clubs (
	id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(128) NOT NULL,
	location VARCHAR(128) NOT NULL,
	music_genre VARCHAR(128) NOT NULL,
	max_capacity INTEGER NOT NULL DEFAULT 100,
	yellow_threshold INTEGER NOT NULL DEFAULT 80,
	occupancy INTEGER NOT NULL DEFAULT 0
);

DELETE FROM clubs;

INSERT INTO clubs(id, name, location, music_genre, max_capacity, yellow_threshold) VALUES
	(1, 'Club Arcane', 'NYC', 'Rock', 100, 70),
	(2, 'Club Underground', 'St. Louis', 'Pop', 50, 30),
	(3, 'Club Soda', 'NYC', 'Metal', 20, 12),
	(4, 'Studio 52', 'Buffalo', 'Grunge', 52, 32);

ALTER SEQUENCE clubs_id_seq RESTART 5;


