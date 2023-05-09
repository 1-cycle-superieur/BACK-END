
const express = require('express')
const router = express.Router();

 
const routs = require('../controllers/user')
router.post('/register',routs.register)

router.post('/login',routs.login)

router.put('/:id',routs.updateUser)

router.delete('/logout', routs.logout);
router.get('/',routs.getAllUsers)

router.delete('/:id',routs.deletuser)


module.exports =router;  
