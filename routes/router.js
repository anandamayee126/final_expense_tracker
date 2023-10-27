const express= require('express');
const router= express.Router();
const User= require('../models/user_db');

router.post('/signup',(req,res) => {
    const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password;

    const exist= User.findOne({where: {email:email}});
    if(exist==null){
        res.json({success: false,message:'already exists'});
    }
    else{
        User.create({name:name,email:email,password:password});
        res.json({success: true,message:'new user registered'});
    }

})

router.post('/login',async(req,res)=>{
    const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password;


    const exist_email= await User.findOne({where: {email:email}});
    console.log(exist_email);

    if(exist_email==null){
        res.json({success:false,message:"User not found .... Please signup first"});
    }
    else{
        if(password!=exist_email.password)
        {
            res.json({success:false,message:"Wrong password"});
        }
        else{
            res.json({success:true,message:"Logged in"});
        }
    }
})

module.exports = router;