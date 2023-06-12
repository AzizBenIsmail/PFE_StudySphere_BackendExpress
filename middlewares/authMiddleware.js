const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt_token;
    if(token){
        jwt.verify(token, 'net attijari secret', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.json('/token  erreur ');
            }else{
                // console.log(decodedToken);
                next();
            }
        })
}else{
    res.json('/pas de token ');
}
}


const requireAuth_checkUser = (req, res, next) => {
    const token = req.cookies.jwt_token;
    if(token){
        jwt.verify(token, 'net attijari secret', async (err, decodedToken) => {
            if(err){
                console.log('il ya une erreur au niveau du token',err.message);
                req.user = null;
                // return res.status(401).send({ message: "Unauthorized" });
                next();
            }else{
                // console.log(decodedToken);
                let user = await userModel.findById(decodedToken.id);
                // console.log(user.username);
                req.user = user;
                next();
            }
        })
}else{
    req.user = null;
    res.json('/pas de token ');
}
}
module.exports = {requireAuth,requireAuth_checkUser};