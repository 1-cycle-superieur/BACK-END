
const express = require('express')
const router = express.Router(); 
 

const rout=require('../controllers/products')


router.post('/',rout.createProduct)
router.get('/',rout.getAllProduct)
router.put('/:id',rout.updateProduct)
router.delete('/:id',rout.deleteOneproduct)


module.exports =router;  