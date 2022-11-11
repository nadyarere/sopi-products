const express = require('express')
const Controller = require('../controllers/controller')
const profileRouter = express.Router()
const { isUser } = require('../middlewares/auth');

// / landing page logo deskripsi ada loginnya ada register tombol

profileRouter.get('/', isUser, Controller.profile)

profileRouter.post('/', isUser, Controller.createProfile)


module.exports = profileRouter