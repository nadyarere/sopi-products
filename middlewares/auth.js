// isadmin
// isuser

const isUser = (req, res, next) => {
    if (!req.session.user) {
        const error = 'You need to register first'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
}


const isLoggin = (req, res, next) => {
    if (req.session.user) {
        res.redirect(`/products`)
    } else {
        next()
    }
}

const isAdmin = (req, res, next) => {
    if (req.session.user.role !== 'Admin') {
        const error = 'You have to be an admin to add'
        res.redirect(`/products?error=${error}`)
    } else {
        next()
    }
}

const isLoggedOut = (req, res, next) => {
    if (!req.session) {
        const error = 'You need to Login first'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
}


module.exports = {
    isUser,
    isLoggin,
    isAdmin,
    isLoggedOut
}