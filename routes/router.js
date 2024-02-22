import express from 'express';
const router= express.Router();
import {User} from '../models/user.js';
import {Order} from '../models/order.js';
import bcrypt from 'bcrypt';
import {Expense} from '../models/expense.js';
import jwt from 'jsonwebtoken';
import middleware from '../middlewares/auth.js';
import Razorpay from 'razorpay';
import Mongoose from 'mongoose';

import Brevo from '@getbrevo/brevo';
// const Sbi= from('sib-api-v3-sdk');
import dot_env from 'dotenv';
import {FP} from '../models/forgetPassword.js';
dot_env.config();


let userId=0;
router.post('/signup',async(req,res) => {
    const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password;

    // const user= new User({name,email,password}); 
    // await user.save();
    // return user;
    const exist= await User.find({email:email});    
    console.log("line 33")                  //ok
    console.log(exist)
    if(exist){
        res.json({success: false,message:'already exists'});
    }
    else{
        const saltRounds=10;
        bcrypt.hash(password, saltRounds,async(err,hash) => {
            
        console.log(err);
        // const random = Ma()
        // console.log(random)
        const newUser= new User({name:name,email:email,password:hash,ispremiumUser:false,totalExpense:0});
        console.log(newUser)    
        await newUser.save();                                        //ok
       // userId=newUser.id;
        console.log("New user created",newUser);                          
        res.json({success: true,message:'new user registered'});
       })
    }

})

function tokenCreation(userId,isPremiumUser)
{
    return jwt.sign({userId:userId,isPremiumUser},'secretKey');
}

router.post('/login',async(req,res)=>{
    const email= req.body.email;
    const password= req.body.password;

    const exist_email= await User.find({email:email});         //ok
    console.log("line 70 of router",exist_email[0]._id);
    
    if(exist_email==null){
        res.json({success:false, status:404, message:"User not found .... Please signup first"});
    }
    else{
        userId= exist_email._id;
        bcrypt.compare(password,exist_email.password,(err,result)=>{         //error in this line
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
//upto this working fine.

router.post('/dailyExpense',middleware,async(req,res)=>{
    const date=req.body.date;
    const amount= req.body.amount;
    const description = req.body.description;
    const category= req.body.category;
    userId= req.user._id;
    console.log("line 97 of router",userId);
    const expense= new Expense(req.user._id,date,amount,description,category);
    const exp= await expense.save();
    const expAmount= await Expense.getExpByUser(userId);
    const user= await User.findId(userId);
    console.log(user)
    user.totalExpense= parseInt(user.totalExpense) + parseInt(amount);
    const update= await User.updateExpense(userId,user.totalExpense)
    console.log("Now total amount is: ",user.totalExpense)
})
    
    // req.user.createExpense(expense).then(async (response) => {
    //     const  total_expense= +req.user.totalExpense+ +amount;
    //     req.user.totalExpense=total_expense;
    //     await req.user.save();
    // //    await t.commit();
    //     console.log(response);
    //     res.json(response);
    // }).catch((err) => {
    //     //    t.rollback();
    //         console.error(err)
    // });
    // const 


router.get('/getExpense',middleware,(req,res) => {
    console.log("user")
    // console.log(req.user)
    let ifPremiumUser=false;
    Expense.getExpense(userId).then((response)=>{ 
        User.findId(userId).then((user) => {
            ifPremiumUser=user.isPremiumUser;
        }).catch((notUser) => {
            ifPremiumUser=false;
        })
        return res.json({response,isPremiumUser : ifPremiumUser}
        )})
        .catch((err) => {
        console.log(err)
    })
})


router.delete('/delete/:id',middleware,async(req,res) => {      //totalexpense bar hoche na tai not working

    const expenseAmount= await Expense.getExpenseOne(req.params.id);  // ok
    console.log("?",expenseAmount)
    const userTotalExpense= await User.findId(expenseAmount[0].userId);   //ok
    console.log("param.id",userTotalExpense);
    userTotalExpense.totalExpense= parseInt(userTotalExpense.totalExpense)-parseInt(expenseAmount[0].amount); 
    const update= await User.updateExpense(req.user._id,userTotalExpense.totalExpense)
    console.log("total expense after deletion is",userTotalExpense.totalExpense);
    Expense.destroy(req.params.id)                                   //  ok
    .then((response) =>{
        res.json({success: true, message:"deleted ->  ",response})})
    .catch((err) => { console.log(err) });
})

router.get('/premiumMembership',middleware,async(req, res) => {
    try{
        
        var rzp= new Razorpay({
            
            key_id: process.env.RAZORPAY_KEY_ID ,
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
         
        // }

        //console.log(req.user)
       
       const newOrder= new Order(req.user._id,null,"PENDING");
       const create= await newOrder.save();
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

router.post('/updateTransaction',middleware,async(req,res)=>{
    try{
        
        console.log("req.body",req.body);
        const {payment_id,order_id} = req.body;
        const order= await Order.findOne(order_id);
        userId= req.user._id;

        const promise1=Order.update(userId,payment_id,"successful");   //problem in this line .... db.collection(...).update is not a function ... check order model
        const promise2= User.updatePremium(userId,true);
        const token= tokenCreation(req.user._id,true);
        Promise.all([promise1, promise2]).then(()=>{
            return res.json({success:true,token,isPremiumUser:true,message:"Transaction successfull"});
        }).catch(err=>{
            console.log(err);
        })
    }
    catch(err){
        console.error(err);
    }
})


router.post('/forgetPassword',async(req,res)=>{
    try{
        const rec_email = req.body.email;
        console.log(rec_email);
        const user = await User.findOne(rec_email);
        console.log(user)
        console.log(user== null)
        if(user === null)
             return res.status(404).json({success : false , msg :"Email not found"})

        var defaultClient = Brevo.ApiClient.instance;
        var apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY

        var apiInstance = new Brevo.TransactionalEmailsApi();

        const sender = { "email": "anandamayee.2000@gmail.com"}

        const reciever = [{
            "email":rec_email
        }]
        const newFp = new FP(req.user._id,false);
        const link= await newFp.save();
        console.log("link",link);
        const response = await apiInstance.sendTransacEmail({
            sender,
            to : reciever,
            subject : 'testing',
            textContent: 'hello , this is a text content',
            htmlContent: '<p>Click the link to reset your password</p>'+
            `<a href="http://127.0.0.1:5500/Password/reset_password.html?reset=${link.id}">click here</a>`
        })
            await FP.update({isActive:true},{where:{id: link.id}});
            return res.json({success : true , response})

        }catch(e){
            console.log(e)
            return res.status(500).json({success : false ,msg :"Internal server error"})
        }
})

router.post('/update-password/:resetId',middleware,async(req,res) => {
    try{
        const id = req.params.resetId;
        const newPassword =req.body.newPassword;
    
        const resetUser= await FP.findByPk(id);
        const user_id= resetUser.userId;
        console.log("user_id",user_id);
        if(!(resetUser.isActive)) {
            return res.json({success : false ,msg :"Link has expired... Please try again"});
        }
        const user= resetUser.getUser();
        const hash=await bcrypt.hash(newPassword,10);

        await User.update({password : hash},{where:{id:user_id}});
        await FP.update({isActive : false},{where:{id:id}});


        return res.status(200).json({success:true,message:"Password updated successfully"});

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal Server error"});
    }


})

router.get('/check-password-link/:resetId',async(req, res) => {
    try{
        const id=req.params.resetId;
        const find=await FP.findOne({where:{id:id}});
        return res.json({isActive:find.isActive});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({success:false, message:"Internal server error!!"});

    }
})

router.post('/get-expense',middleware,async(req, res)=>{
    try {
        const page = +req.query.page || 1
        const items = +req.body.items || 5
        console.log("max no. of items per page",items);
        const exp = await  Expense.getExpByUser(req.user._id,
            offset= (page - 1) * items,
            limit= items
        )
        const totalExp = await Expense.countExpenses(req.user._id);
        console.log("line 313 of router",totalExp);
        console.log("all expenses are: ",exp)
        // const [expenses ,totalExpenses ] = await Promise.all([exp , totalExp])
        return res.json({expenses:exp});
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
})


export default router;

