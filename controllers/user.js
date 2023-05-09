const express = require('express');
const bcrypt = require('bcrypt');
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


exports.register = async (req, res, next) => {

  console.log(req.body);


  hashh = bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({
        msg: err
      });
    } else {
      const q =
        `INSERT INTO user (id, username,address,email,password,role ) VALUES (  
              ${db.escape(req.body.id)}, ${db.escape(req.body.username)}, ${db.escape(req.body.address)},${db.escape(req.body.email)}, 
              ${db.escape(hash)},${db.escape(req.body.role)}
              
          )`

      db.query(q,
        (err, result) => {
          if (err) {
            throw err;

          }
          console.log(result)
          return res.status(201).send({
            msg: 'Registered!',

          });
        }
      );
    }


  })
}






//login

exports.login = (req, res) => {
  console.log('login')
  db.query(
    `SELECT * FROM user WHERE email =${db.escape(req.body.email)};`,

    (err, result) => {
      // user does not exists
      if (err) {
        throw err;

      };
      if (!result.length) {
        return res.status(401).send({
          msg: 'email or password is incorrect!'
        });
      }
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            throw bErr;

          }
          if (bResult) {
            const token = jwt.sign({
              nom: result[0].nom,
              userId: result[0].id,
              userRole: result[0].role

            },
              'SECRETKEY', {
              expiresIn: '7d'
            },

            );

            return res.cookie("accessToken", token, {
              httpOnly: true,
            })
              .status(200).send({

                msg: 'Logged in!',
                token,
                user: result[0],

              });
          }

          return res.status(401).send({
            msg: 'email or password is incorrect!'
          });
        }
      );
    }

  );
};
//*************************************

// logout

exports.logout = (req, res) => {
  console.log('loging out...')
  res.clearCookie("accessToken");
  res.status(200).json({
    message: "logout"
  });
}


//Récupérer la liste des users
exports.getAllUsers = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");
  const userInfo = jwt.decode(token, "SECRETKEY");
  if (userInfo.userRole !== 'admin') { return res.status(401).json("Not authenticated!") } else {
    db.query(
      `select * from user`,
      (err, result) => {
        if (err) {
          throw err;

        }
        return res.status(201).send({

          user: result
        });
      });
  };
};

//MODIFIER PROFILE
exports.updateUser = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");
  const userInfo = jwt.decode(token, "SECRETKEY");
  if (userInfo.userRole !== 'admin') { return res.status(401).json("Not authenticated!") } else {
    const q =
      "UPDATE user SET `username`=?,`password`=?,`email`=?,`address`=?  WHERE id=? ";

    db.query(
      q,
      [

        req.body.username,
        req.body.password,
        req.body.email,
        req.body.address,
        req.params.id
      ],
      (err, result) => {
        if (err) res.status(500).json(err);
        if (result) return res.json("Updated!");
      }
    );
  }
};
//SUPPRIMER UN UTILISATEUR

exports.deletuser = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");
  const userInfo = jwt.decode(token, "SECRETKEY");
  if (userInfo.userRole !== "admin") { return res.status(401).json("Not authenticated!") } else {


    const q =
      "DELETE FROM user WHERE  `id` = ?";

    db.query(q, [req.params.id],
      (err, result) => {
        if (err) res.status(500).json(err);
        if (result) return res.json("deleted!");
      });
  }
};

