import jwt from 'jsonwebtoken';
import {User} from '../models/user.js';

const middleware= async(req,res,next) => {
    try{
        const token= req.header('Authorization');
        const user= jwt.verify(token,'secretKey')
        console.log(user)
        console.log("line 9 auth")
        req.user = await User.findById(user.userId);
        console.log("req.user",req.user)
        next();
        
    }
    catch(err) {
        console.log(err)
        res.status(403).json({success: false});
    } 
}
export default middleware;