const jwt = require('jsonwebtoken')


const checkAuth = (req, res, next)=>
{
    try{

        
        //Authorization: Bearer <token>
        
        const token = req.get('Authorization').split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        next();



    }catch(error){
        return res.json({
            message : 'Authentication Failed',
            status : false
        })
    }
}



module.exports = checkAuth;