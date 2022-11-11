const express = require('express')
const Controller = require('../controllers/controller')
const orderRouter = express.Router()
const { isUser, isAdmin } = require('../middlewares/auth');

orderRouter.get('/', isUser, Controller.ordersPage)

orderRouter.get('/:ordersId/delivered', isUser, isAdmin, Controller.delivered)

orderRouter.get('/:ordersId/delete', isUser, Controller.deleteOrder)

module.exports = orderRouter