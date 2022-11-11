const express = require('express')
const Controller = require('../controllers/controller')
const logoutRouter = express.Router()

// / landing page logo deskripsi ada loginnya ada register tombol

logoutRouter.get('/', Controller.logout)


module.exports = logoutRouter