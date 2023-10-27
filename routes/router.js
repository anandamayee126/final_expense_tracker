const express= require('express');
const router= express.Router();
const User= require('../models/user_db');
const bcrypt= require('bcrypt');

router.post('/signup',(req,res) => {
    const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password;
    
    const exist= User.findOne({where: {email:email}});
    if(exist==null){
        res.json({success: false,message:'already exists'});
    }
    else{
        const saltRounds=10;
        bcrypt.hash(password, saltRounds,async(err,hash) => {
        console.log(err);
        await User.create({name:name,email:email,password:hash});
        res.json({success: true,message:'new user registered'});
       })
    }

})

router.post('/login',async(req,res)=>{
    // const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password;


    const exist_email= await User.findOne({where: {email:email}});
    console.log(exist_email);

    if(exist_email==null){
        res.json({success:false, status:404, message:"User not found .... Please signup first"});
    }
    else{
        bcrypt.compare(password,exist_email.password,(err,result)=>{
            if(err){
                res.json({success:false,message:"Something went wrong"});
            }
            else if(result===true){
                res.json({success:true,message:"User login successfull"});

            }
            else{
                res.json({success:false,status:401, message:"Password Incorrect"});
            }
        })
    }
})


router.post('/dailyExpense',(req,res)=>{
    const amount= req.body.amount;
    const description = req.body.description;
    const category= req.body.category;

    
})
module.exports = router;