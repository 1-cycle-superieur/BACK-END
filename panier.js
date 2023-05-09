const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2/promise');
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors=require('cors');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  password: "mysqlamani20",
  database: "projet1cs"
});

pool.getConnection((error, connection) => {
  if (error) throw error;
  else console.log('Connected to database');
});

app.get("/panier", (req, res) => {
});

app.post("/Ajouterpanier", async (req, res) => {
  // const token = req.cookies.accessToken;
  // if (!token) return res.status(401).json("Not authenticated!");
  // const userInfo = jwt.decode(token,"SECRETKEY");
  // if (userInfo.userRole!=='user') return res.json("access denied")
  // const idUser=userInfo.userID;
  try {
    const userId=req.body.userId;
    const idProduct = req.body.idProduct;
    const quantity = req.body.quantity;
    if (!idProduct || !userId ||!quantity) {
      return res.status(400).send("Bad Request: Missing required parameters");
    }
    const [results]=await pool.query(`INSERT INTO paniers(idProduct,idUser,quantity,datePanier) values(?,?,?,?)`, [idProduct, userId, quantity,new Date()]);
    
    if (results.affectedRows === 0) {
      return res.status(404).send("Resource not found");
    }

    return res.json("done");

  } catch (error) {
    console.error('Error executing query: ' + error.stack);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/deletefrompanier", async (req, res) => {
  try {
    const idProduct = req.body.idProduct;
    const userId
     = req.body.userId;

    if (!idProduct || !userId) {
      return res.status(400).send("Bad Request: Missing required parameters");
    }
    const [results] = await pool.query(
      "DELETE FROM paniers WHERE idProduct = ? AND idUser = ?",
      [idProduct, userId]
    );

    if (results.affectedRows === 0) {
      return res.status(404).send("Resource not found");
    }

    return res.send("done");
  } catch (error) {
    console.error("Error executing query: " + error.stack);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/deletepanier", async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).send("Bad Request: Missing required parameters");
    }
    const [results] = await pool.query(
      "DELETE FROM paniers WHERE idUser = ?",
      [userId]
    );

    if (results.affectedRows === 0) {
      return res.status(404).send("Resource not found");
    }

    return res.send("done");
  } catch (error) {
    console.error("Error executing query: " + error.stack);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/Acheterpanier",async(req,res)=>{
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).send("Bad Request: Missing required parameters");
    }

    // const[results]=await pool.query(`SELECT quantite from products where id= (select idProduct FROM paniers WHERE idUser = ?)`,[userId])
    
    // if (results.affectedRows === 0) {
    //   return res.status(404).send("Resource not found");
    // }
    // if (results[0].quantity===0) {
    //   return res.status(404).send("This product is not available");
    // }
    const [resultat]=pool.query(`SELECT idUser, idProduct, quantity
    FROM paniers
    WHERE idUser = ?;`);
    if (resultat.affectedRows === 0) {
      return res.status(404).send("Resource not found");
    }

const insertQuery = `
INSERT INTO acheter (idUser, idProduct, quantity) values (?,?,?)
`;

const deleteQuery = `
DELETE FROM paniers
WHERE idUser = ?;
`;

var [results]=await pool.query(insertQuery, [resultat[0].idUser,resultat[0].idProduct,resultat[0].quantity]);
if (results.affectedRows === 0) {
  return res.status(404).send("Resource not found");
}
[results]=await pool.query(deleteQuery, [userId]);

    if (results.affectedRows === 0) {
      return res.status(404).send("Resource not found");
    }
    return res.send("done");
  } catch (error) {
    console.error("Error executing query: " + error.stack);
    return res.status(500).send("Internal Server Error");
  }

})

app.listen(5222, () => {
  console.log("listening to port 5222");
});
