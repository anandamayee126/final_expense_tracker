const express= require('express');
const router= express.Router();
const User= require('../models/user_db');
const bcrypt= require('bcrypt');
const Expense= require('../models/expense_db');
const jwt= require('jsonwebtoken');



let userId=null;
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
        const newUser= await User.create({name:name,email:email,password:hash});
        userId=newUser.id;
        res.json({success: true,message:'new user registered'});
       })
    }

})

function tokenCreation(userId)
{
    return jwt.sign({userId:userId},'987654345678889desewer5678hytrewsdfgt678');
}

router.post('/login',async(req,res)=>{
    const email= req.body.email;
    const password= req.body.password;

    const exist_email= await User.findOne({where: {email:email}});
    console.log(exist_email);
    userId= exist_email.id;

    if(exist_email==null){
        res.json({success:false, status:404, message:"User not found .... Please signup first"});
    }
    else{
        bcrypt.compare(password,exist_email.password,(err,result)=>{
            if(err){
                res.json({success:false,message:"Something went wrong"});
            }
            else if(result===true){
                return res.json({success:true,message:"User login successfull",token:tokenCreation(userId)});
            }
            else{
                res.status(403).json({success:false,message:"incorrect password"});
            }
        })
    }
})


router.post('/dailyExpense',(req,res)=>{
    const amount= req.body.amount;
    const description = req.body.description;
    const category= req.body.category;
    const userDbId= userId;
    

    const expense= {
        amount,description,category,userDbId
    }
    userId=null;
    const request= Expense.create(expense).then(response => {
        console.log(response);
    }).catch(err => {
        console.log(err);
    })
})

router.get('/',(req,res) => {
    Expense.findAll({where:{userDbId:userId}});

})
module.exports = router;

