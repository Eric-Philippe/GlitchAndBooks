CREATE TABLE Users (
   userId SERIAL PRIMARY KEY,
   username VARCHAR(55) UNIQUE,
   password VARCHAR(55) NOT NULL
);

CREATE TABLE Authors (
   authorId SERIAL PRIMARY KEY,
   firstname VARCHAR(155),
   lastname VARCHAR(155) NOT NULL
);

CREATE TABLE Languages (
   languagesId SERIAL PRIMARY KEY,
   language VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE Genres (
   genresId SERIAL PRIMARY KEY,
   name VARCHAR(50) NOT NULL
);

CREATE TABLE Types (
   typesId SERIAL PRIMARY KEY,
   name VARCHAR(50) NOT NULL
);

CREATE TABLE Country_origin (
   countryOriginId SERIAL PRIMARY KEY,
   country VARCHAR(50) NOT NULL
);

CREATE TABLE Wishlist (
   wishlistId SERIAL PRIMARY KEY,
   title VARCHAR(50) NOT NULL,
   author VARCHAR(155) NOT NULL,
   price MONEY,
   userId INT NOT NULL REFERENCES Users(userId)
);

CREATE TABLE Books (
   bookId SERIAL PRIMARY KEY,
   title VARCHAR(255) NOT NULL,
   page_number SMALLINT,
   height INT,
   width INT,
   read BOOLEAN NOT NULL,
   publication_date DATE,
   want_to_read BOOLEAN NOT NULL,
   notes TEXT,
   physical BOOLEAN NOT NULL,
   countryOriginId INT NOT NULL REFERENCES Country_origin(countryOriginId),
   typesId INT NOT NULL REFERENCES Types(typesId),
   languagesId INT NOT NULL REFERENCES Languages(languagesId),
   userId INT NOT NULL REFERENCES Users(userId)
);

CREATE TABLE written_by (
   bookId INT REFERENCES Books(bookId),
   authorId INT REFERENCES Authors(authorId),
   PRIMARY KEY(bookId, authorId)
);

CREATE TABLE has_genres (
   bookId INT REFERENCES Books(bookId),
   genresId INT REFERENCES Genres(genresId),
   PRIMARY KEY(bookId, genresId)
);
