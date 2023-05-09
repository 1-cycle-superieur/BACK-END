const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();
var mysql = require("mysql");

const db = mysql.createPool({
  connectionLimit: 100,
  port: process.env.DB_port,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true
});


//connect to db
db.getConnection((err, connection) => {
  if (err) throw err; //not connected
  console.log('Connected as ID ' + connection.threadId);


})


//AFFICHER LES PRODUITS
exports.getAllProduct = (req, res) => {
  db.query(
    `select * from products `,
    (err, result) => {
      if (err) {
        throw err;

      }
      return res.status(201).send({

        products: result
      });
    });
};
//CREATION DU PRODUIT
exports.createProduct = (req, res) => {
  const token = req.cookies.accessToken;
  console.log(token)
  if (!token) return res.status(401).json("Not logged in!");
  const userInfo = jwt.decode(token, "SECRETKEY");

  if (userInfo.userRole !== "admin") { return res.status(401).json("Not authenticated!") } else {
    //const id=uuid.v4()
    db.query(
      `INSERT INTO products (id, nom,prix,marque,quantite, vendue,taille ) VALUES (  
            ${db.escape(req.body.id)}, ${db.escape(req.body.nom)},${db.escape(req.body.prix)}, 
            ${db.escape(req.body.marque)}, ${db.escape(req.body.quantite)},false,
           ${db.escape(req.body.taille)}
        )`,
      (err, result) => {
        if (err) {
          throw err;


        }
        return res.status(201).send({
          message: 'reussite',
          product: result[0]
        });
      }
    );
  }
}
//MODIFIER PRODUIT
exports.updateProduct = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");
  const userInfo = jwt.decode(token, "SECRETKEY");
  if (userInfo.userRole !== "admin") { return res.status(401).json("Not authenticated!") } else {
    const q =
      "UPDATE products SET `nom`=?,`prix`=? ,`marque`=? ,`quantite`=?,`taille`=? WHERE id=? ";

    db.query(
      q,
      [

        req.body.nom,
        req.body.prix,
        req.body.marque,
        req.body.quantite,
        req.body.taille,

        req.params.id
      ],
      (err, result) => {
        if (err) res.status(500).json(err);
        if (result) return res.json("Updated!");
      }
    );
  }
};
//delete product
exports.deleteOneproduct = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  const userInfo = jwt.decode(token, "SECRETKEY");
  if (userInfo.userRole !== "admin") { return res.status(401).json("Not authenticated!") } else {

    const q =
      "DELETE FROM products WHERE `id`=? ";

    db.query(q, [req.params.id],
      (err, result) => {
        if (err) res.status(500).json(err);
        if (result) return res.json("deleted!");
      });
  };
}



