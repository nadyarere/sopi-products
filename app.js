if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require('express')
const app = express()
const session = require('express-session')
const port = 3000 || process.env.PORT 
const router = require('./routes');

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))

app.use('/', router)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})