const express = require('express')
const Controller = require('../controllers/controller')
const loginRouter = express.Router()
const {isLoggin} = require('../middlewares/auth');

// / landing page logo deskripsi ada loginnya ada register tombol

loginRouter.get('/', isLoggin, Controller.loginForm)

loginRouter.post('/', Controller.login)


module.exports = loginRouter