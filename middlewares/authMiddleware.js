    const jwt = require("jsonwebtoken");
    const userModel = require("../models/userSchema");

    const requireAuthUser = (req, res, next) => {
        const token = req.cookies.jwt_token;
        if(token){
            jwt.verify(token, 'net attijari secret', async (err, decodedToken) => {
                if(err){
                    console.log('il ya une erreur au niveau du token',err.message);
                    req.session.user = null;
                    res.json('/Problem_token ');
                }else{
                    req.session.user = await userModel.findById(decodedToken.id);
                    next();
                }
            })
    }else{
        req.session.user = null;
        res.json('/pas_de_token ');
        
    }
    }
    module.exports = {requireAuthUser};