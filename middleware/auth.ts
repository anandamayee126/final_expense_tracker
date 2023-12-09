import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user';

const authenticate= ((req:any,res:any,next:any) => {
    try{
        const token= req.header('Authorization');
        const user= jwt.verify(token,'secretKey') as JwtPayload;
        User.findByPk(user.userId).then((user:any) => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch((err:any) => { console.log(err)
        })
    }
    catch(err) {
        console.log(err)
        res.status(403).json({success: false});
    } 
})

export default authenticate;