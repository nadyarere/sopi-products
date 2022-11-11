const express = require('express');
const Controller = require('../controllers/controller')
const router = express.Router()
const {isLoggin} = require('../middlewares/auth');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const orderRouter = require('./orders');
const productRouter = require('./products');
const profileRouter = require('./profile');
const registerRouter = require('./register');

// / landing page logo deskripsi ada loginnya ada register tombol

router.get('/', isLoggin, Controller.landingPage)
router.use('/login', loginRouter)
router.use('/logout', logoutRouter)
router.use('/orders', orderRouter)
router.use('/products', productRouter)
router.use('/profile', profileRouter)
router.use('/register', registerRouter)

module.exports = router