CREATE DATABASE riad;
use riad;
CREATE TABLE user (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  address TEXT NOT NULL,
   email TEXT NOT NULL,
  password varchar(255) NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  nom TEXT NOT NULL,
  prix REAL NOT NULL,
  marque TEXT NOT NULL,
  quantite int not null,
  vendue BOOLEAN,
  taille TEXT NOT NULL,
   );