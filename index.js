const express=require ('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const userRoutes =require("./routes/userroutes");
const productRoutes= require ("./routes/productroutes");
const PORT= process.env.PORT || 4000;
app.use(cors())
app.use(express.json());
 app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(cookieParser());

 app.use("/products", productRoutes);
 app.use("/users", userRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    })