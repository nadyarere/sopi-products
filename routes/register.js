const express = require('express')
const Controller = require('../controllers/controller')
const registerRouter = express.Router()
const {isLoggin} = require('../middlewares/auth');

// / landing page logo deskripsi ada loginnya ada register tombol


registerRouter.get('/', isLoggin, Controller.registerForm)
registerRouter.post('/', Controller.register)


module.exports = registerRouter