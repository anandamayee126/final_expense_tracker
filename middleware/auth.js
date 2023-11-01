const jwt= require('jsonwebtoken');
const User = require('../models/user');

const authenticate= (req, res, next) => {
    try{

        const token= req.header('Authorization');
        const user= jwt.verify(token,'secretKey');
        User.findByPk(user.userId).then((user) => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch(err => { throw new Error(err)
        })
    }
    catch(err) {
        res.status(403).json({success: false});
    }
}

module.exports= authenticate;