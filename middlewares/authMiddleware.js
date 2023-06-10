const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt_token;

    if(token){
        jwt.verify(token, 'net attijari secret', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.json('/token  erreur ');
            }else{
                console.log(decodedToken);
                next();
            }
        })
}else{
    res.json('/pas de token ');
}
}
module.exports = {requireAuth};