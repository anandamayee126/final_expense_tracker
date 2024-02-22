import jwt from 'jsonwebtoken';
import {User} from '../models/user.js';

const middleware= async(req,res,next) => {
    try{
        const token= req.header('Authorization');
        const user= jwt.verify(token,'secretKey')
        console.log(user)
        console.log("line 9 auth")
        // console.log("line 8 of auth",user.userId);
        // User.findId(user.userId).then((user) => {

        //     // console.log("line 9 of auth",user);
        //     // req.user = user;
        //     next();
        // }).catch((err) => { console.log(err)
        // })
        // req.userId = user.userId;
        req.user = await User.findId(user.userId)
        console.log(req.user)
        next();
        
    }
    catch(err) {
        console.log(err)
        res.status(403).json({success: false});
    } 
}
export default middleware;