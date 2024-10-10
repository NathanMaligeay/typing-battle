-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	user_id serial4 NOT NULL,
	username varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (user_id),
	CONSTRAINT users_unique UNIQUE (username)
);


-- public.games definition

-- Drop table

-- DROP TABLE public.games;

CREATE TABLE public.games (
	game_id serial4 NOT NULL,
	user_id int4 NOT NULL,
	words_typed int4 DEFAULT 0 NOT NULL,
	accuracy float4 DEFAULT 0 NULL,
	score int4 DEFAULT 0 NOT NULL,
	CONSTRAINT games_pk PRIMARY KEY (game_id)
);


-- public.games foreign keys

ALTER TABLE public.games ADD CONSTRAINT games_users_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id);