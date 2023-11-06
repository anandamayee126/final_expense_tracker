const express= require('express');
const router= express.Router();
const User= require('../models/user');
const Order= require('../models/order');
const bcrypt= require('bcrypt');
const Expense= require('../models/expense');
const jwt= require('jsonwebtoken');
const middleware= require('../middleware/auth');
const Razorpay= require('razorpay');
const dot_env= require('dotenv');
dot_env.config();


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
       // userId=newUser.id;
        res.json({success: true,message:'new user registered'});
       })
    }

})

function tokenCreation(userId,isPremiumUser)
{
    return jwt.sign({userId:userId,isPremiumUser},'secretKey');    ////////////////
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
                return res.json({success:true,message:"User login successfull",token:tokenCreation(userId,req.user.isPremiumUser)});
            }
            else{
                res.status(403).json({success:false,message:"incorrect password"});
            }
        })
    }
})


router.post('/dailyExpense',middleware,(req,res)=>{
    const amount= req.body.amount;
    const description = req.body.description;
    const category= req.body.category;

    const expense= {
        amount,description,category
    }
    
    req.user.createExpense(expense).then(response => {
        
        console.log(response);
        res.json(response);
    }).catch(err => {console.error(err)});
})

router.get('/getExpense',middleware,(req,res) => {
    
    req.user.getExpenses().then(response=>res.json(response)).catch(err => { throw new Error(err)})
})


router.delete('/delete/:id', (req,res) => {
   
        Expense.destroy({where:{id:req.params.id}}).then((response) => res.json({success: true, message:"deleted ->  ",response})).catch(err => { throw new Error(err)})
 
})

router.get('/premiumMembership',middleware,async(req, res) => {
    try{
        var rzp= new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const options={
            amount : 2500,
            currency:"INR"
        };
        const order = await rzp.orders.create(options)   
        console.log("order",order);         
        // if(err){
        //         console.log(err);
        //     }

        //console.log(req.user)
       
       await req.user.createOrder({order_id : order.id , status :"PENDING"})
    //    await Order.create({order_id : order.id , status :"PENDING",userId :userId}) //
        return res.status(201).json({order,key_id:rzp.key_id})
         
    }
    catch(err){

        console.log(err);
    
    }
})

router.post('/updateTransaction',middleware,(req,res)=>{
    try{
        console.log("req.body",req.body);
        const {payment_id,order_id} = req.body;
        Order.findOne({where:{order_id:order_id}}).then(async order=>{
            order.payment_id=payment_id;
            order.status="successful";
            await order.save();
            req.user.isPremiumUser=true;
            await req.user.save();
            return res.json({success:true});
            
        }).catch(err=>{
            console.error(err);
        })
    }
    catch{
        console.error(err);
    }
})

module.exports = router;

