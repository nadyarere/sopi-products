const express = require('express')
const app = express()

const bcrypt = require('bcryptjs');
const { User, Product, Category, Profile, Order, sequelize } = require('../models/index');
const { currency } = require('../helpers/index');
const { Op, where } = require('sequelize');
const bp = require('body-parser')
const qr = require('qrcode')
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())

class Controller {
    static landingPage (req, res) {
        res.render('landingPage')
    }

    static loginForm (req, res) {
        const error = req.query.error
    
        res.render('loginPage', { error })
    }

    static login (req, res) {
        const { email, password } = req.body
    
        User.findOne({
            where: { email }
        })
            .then((user) => {
                if (!user) {
                    res.redirect('/products')
                } else {
                    const isValidPassword = bcrypt.compareSync(password, user.password)
    
                    if (isValidPassword) {
                        const { id, role, name } = user
    
                        req.session.user = { id, role, name }
                        
                        res.redirect('/products')
                    } else {
                        res.redirect(`/login?error=${'Invalid Email or Password'}`)
                    }
                }
            }).catch((err) => {
                res.send(err)
            });
    }

    static logout (req, res) {
        if (req.session) {
            req.session.destroy()
            res.redirect('/')
        }
    }

    static registerForm (req, res) {
        const errors = req.query.errors

        res.render('registerPage', {errors})
    }

    static register (req, res) {
        const { email, password, role, name } = req.body
    
        User.create({
            email,
            password,
            role,
            name
        })
            .then(() => {
                res.redirect('/login')
            }).catch((err) => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    let listOfErrors = err.errors.map(el => {
                        return el.message
                    })
    
                    res.redirect(`/register?errors=${listOfErrors}`)
                } else {
                    res.send(err)
                }
            });
    
    }

    static productsPage (req, res) {
        const error = req.query.error
        const id = req.session.user.id
        let user = {}

        const searchKey = req.query.search
        const sort = req.query.sort
        const option = { include: Category }

        if (searchKey) {
            option.where = {
                name: {
                    [Op.iLike]: `%${searchKey}%`
                }
            }
        }

        if (sort) {
            option.order = [['name', 'ASC']]
        }

        User.findByPk(id)
            .then((result) => {
                user = result
                return Product.findAll(option)
            })

            .then((result) => {
                res.render('products', { user, products: result, error, currency })
            })
            .catch((err) => {
                res.send(err)
            });
    }

    static addProductForm (req, res) {
        const errors = req.query.errors
    
        Category.findAll({
            attributes: ['id', 'name']
        })
            .then((result => {
                res.render('addProduct', { result, errors })
            }))
            .catch(err => {
                res.send(err)
            })
    
    }

    static addProduct (req, res) {
        const { name, description, price, CategoryId } = req.body
    
        Product.create({
            name,
            description,
            price,
            CategoryId
        })
            .then((_) => {
                res.redirect('/products')
            })
            .catch(err => {
                if (err.name === "SequelizeValidationError") {
                    let listOfErrors = err.errors.map(el => {
                        return el.message
                    })
    
                    res.redirect(`/products/add?errors=${listOfErrors}`)
                } else {
                    res.send(err)
                }
            })
    }

    static profile (req, res) {
        
        const { id, name, role } = req.session.user
    
        Profile.findOne({
            where: {
                UserId: id
            },
            include: {
                model: User
            }
        })
            .then((result) => {
                // res.send(result)
                res.render('profile', { profile: result, name, role, Profile })
            }).catch((err) => {
                res.send(err)
            });
    }

    static createProfile (req, res) {
        const { name, address, phone } = req.body
    
        Profile.create({
            name,
            address,
            phone,
            UserId: req.session.user.id
        })
            .then(() => {
                res.redirect('/profile')
            }).catch((err) => {
                res.send(err)
            });
    }

    static ordersPage (req, res) {
        const user = req.session.user
        let categories = 0
        let orders = []
        let profiles = []
    
        Category.findAll({
            attributes: {
                include: [
                    [sequelize.fn('sum', sequelize.col('Products.Orders.price')), 'totalPrice']
                ]
            },
            include: {
                model: Product,
                include: {
                    model: Order,
                    attributes: []
                },
                attributes: []
            },
            group: [
                ['Category.id', 'Category.name']
            ]
        })
            .then((result) => {
                categories = result
                return Order.findAll({
                    include: [
                        { model: User },
                        { model: Product },
                    ],
                    //kasih where kelupaan
                    where: {
                        UserId: user.id
                    }
                })
            })
            .then((result) => {
                orders = result
                return Profile.findAll()
            })
            .then((result) => {
                profiles = result
                return Order.count({
                    where: {UserId: user.id}
                })
            })
            .then((result) => {
                let sumOrder = 0
                categories.forEach(el => {
                    if(el.dataValues.totalPrice === null){
                        sumOrder += 0
                    } else {
                        sumOrder += +el.dataValues.totalPrice
                    }
                })
                
                res.render('orders', { orders, categories, currency, user, profiles, countOrder: result, sumOrder })
            })
            .catch((err) => {
                res.send(err)
            });
    }

    static deleteOrder (req,res) {
        const id = req.params.ordersId
        Order.destroy({
            where: {id}
        })
        .then(() => {
            res.redirect('/orders')
        }).catch((err) => {
            res.send(err)
        });
    }

    static buyProduct (req, res) {
        const productId = req.params.productId
        const UserId = req.session.user.id
    
        let product = {}
        Product.findByPk(productId)
            .then((result) => {
                product = result
                return Order.create({
                    UserId: UserId,
                    ProductId: productId,
                    price: product.price
                })
            })
            .then(() => {
                res.redirect('/products')
            })
            .catch((err) => {
                res.send(err)
            });
    }

    static deleteProduct (req, res) {
        const ProductId = req.params.productId
        
        Order.destroy({
            where:{
                ProductId
            }
        })
        .then(result => {
            return Product.destroy({
                where: { id: ProductId }
            })
        })
            .then(() => {
                res.redirect('/products')
            }).catch((err) => {
                res.send(err)
            });
    }

    static delivered (req,res) {
        const id = req.params.ordersId
    
        Order.update(
            {orderStatus: 'Delivered'},
            {where: {id}}
        )
        .then((result) => {
            res.redirect('/orders')
        }).catch((err) => {
            res.send(err)
        });
    }

    static renderEditProduct(req, res) {
        const errors = req.query.errors
        const ProductId = req.params.productId
        let product = {}

        Product.findByPk(ProductId)
            .then((result) => {
                product = result
                return Category.findAll({
                    attributes: ['name', 'id']
                })
            })
            .then((categories) => {
                res.render('editForm', { product, categories, errors })
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static handleEditProduct(req, res) {
        const { name, description, price, CategoryId } = req.body
        const id = req.params.productId
        // console.log(name);
        Product.update({
            name,
            description,
            price,
            CategoryId
        }, {
            where: {
                id: id
            }
        }).then((_) => {
            res.redirect('/products')
        })
            .catch((err) => {
                if (err.name === "SequelizeValidationError") {
                    let listOfErrors = err.errors.map(el => {
                        return el.message
                    })

                    res.redirect(`/products/${id}/edit?errors=${listOfErrors}`)
                }
            })
    }

    static renderProductDetail (req, res) {
        const id = req.params.productid

    Product.findByPk(id)
        .then((result) => {

            let link = `https://www.google.com/search?q=${result.name}`

            qr.toDataURL(link, (err, src) => {

                res.render('productDetail', { result, src })

            })


        })
        .catch(err => {
            res.send(err)
        })
    }
}

module.exports = Controller