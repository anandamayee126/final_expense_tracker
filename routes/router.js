const express= require('express');
const router= express.Router();
const User= require('../models/user');
const Order= require('../models/order');
const bcrypt= require('bcrypt');
const Expense= require('../models/expense');
const jwt= require('jsonwebtoken');
const middleware= require('../middleware/auth');
const Razorpay= require('razorpay');
const Sib= require('sib-api-v3-sdk');
const sequelize= require('../util/db');
const t= sequelize.transaction();
const dot_env= require('dotenv');
const FP= require('../models/forgetPassword');
dot_env.config();


let userId=null;
router.post('/signup',async(req,res) => {
    const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password;
    
    
    const exist= await User.findOne({where: {email:email}});
    if(exist!=null){
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
    
    if(exist_email==null){
        res.json({success:false, status:404, message:"User not found .... Please signup first"});
    }
    else{
        userId= exist_email.id;

        bcrypt.compare(password,exist_email.password,(err,result)=>{
            if(err){
                res.json({success:false,message:"Something went wrong"});
            }
            else if(result===true){
                return res.json({success:true,message:"User login successfull",token:tokenCreation(userId,exist_email.isPremiumUser)});
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
    
    req.user.createExpense(expense,{transaction:t}).then(async response => {

        const  total_expense= Number(req.user.totalExpense)+Number(amount);
        req.user.totalExpense=total_expense;
        await req.user.save();
        t.commit();
        console.log(response);
        res.json(response);
    }).catch(
        err => {
            t.rollback();
            console.error(err)
        });
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

// function parseJwt (token) {
//         var base64Url = token.split('.')[1];
//         var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
//             return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//         }).join(''));
    
//         return JSON.parse(jsonPayload);
//     }

router.post('/updateTransaction',middleware,(req,res)=>{
    try{
        
        console.log("req.body",req.body);
        const {payment_id,order_id} = req.body;
        Order.findOne({where:{order_id:order_id}}).then(async order=>{
            order.payment_id=payment_id;
            order.status="successful";
            await order.save();
            req.user.isPremiumUser=true;
            const token= tokenCreation(userId,true);
           // const decodedToken= parseJwt(token);
            await req.user.save();

            return res.json({success:true,token:tokenCreation(userId,true),isPremiumUser:true});
            
        }).catch(err=>{
            console.error(err);
        })
    }
    catch{
        console.error(err);
    }
})


router.post("/forgetPassword",middleware,(req,res)=>{
    const email= req.body.email;
    const client= Sib.ApiClient.instance;
    const apiKey=client.authentications['api-key']
    apiKey.apiKey=process.env.API_KEY;

    const transEmailapi= new Sib.TransactionalEmailsApi();

    const sender={
        email: "anandamayee.2000@gmail.com",
        name: "Anandamayee"
    }
    const receiver=[
        {
            email: email
        }
    ] 
  transEmailapi.sendTransacEmail({
    sender,
    to: receiver,
    subject:"RESET PASSWORD",
    textContent: "Please Enter new password"
  }).then((response) => {
    console.log(response)
    res.json({success: true, message:"Mail sent"})
  }).catch((err) => {
    console.log(err)
  })

})

router.post('/resetPassword',middleware,(req,res) => {
    const id = req.params.id;
    FP.findOne({where: {id: id}}).then(forgetPassword=>{

    })


})


module.exports = router;

