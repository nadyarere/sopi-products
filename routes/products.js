const express = require('express')
const Controller = require('../controllers/controller')
const productRouter = express.Router()
const { isUser, isAdmin } = require('../middlewares/auth');

// / landing page logo deskripsi ada loginnya ada register tombol

productRouter.get('/', isUser, Controller.productsPage)

productRouter.get('/add', isUser, isAdmin, Controller.addProductForm)
productRouter.post('/add', Controller.addProduct)
productRouter.get('/:productid', Controller.renderProductDetail)
productRouter.get('/:productId/buy', Controller.buyProduct)
productRouter.get('/:productId/edit', Controller.renderEditProduct)
productRouter.post('/:productId/edit', Controller.handleEditProduct)
productRouter.get('/:productId/delete', isAdmin, Controller.deleteProduct)

module.exports = productRouter