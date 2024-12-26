const {JWT_SECRET} = require ("./config");

const jwt = require("jsonwebtoken");

const authMiddleWare= (req,res,next)=>{
    const authHeader = req.headers.authorization;

if (!authHeader || ! authHeader.startsWith('Bearer')){
    return res.status(401).json({
        message: "Please add a valid authorization header / header starting with Bearer "
    })
}

const token = authHeader.split(' ')[1];
try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;
    console.log(req.userId)
    next();
} catch (err) {
    return res.status(403).json({
        message: "Invalid or expired token.",
        error: err.message
    });
}
}

const adminMiddleware = (req, res, next) =>{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({
            message: "Please add a valid authorization header / header starting with Bearer"
        })
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded =jwt.verify(token, JWT_SECRET);
        if (decoded.userRole==="admin"){
         req.userId = decoded.userId;
         next();   
        }
        else{
            return res.status(403).json({
                message: "You are not authorized to access this route."
            })
        }
    }
    catch(err){
        return res.status(403).json({
            message: "Invalid or expired token.",
            error: err.message
        })
    }
}
module.exports = {
    authMiddleWare,
    adminMiddleware

};
