import express from'express';
const router= express.Router();
import User from'../models/user';
import Order from '../models/order';
import bcrypt from'bcrypt';
import Expense from'../models/expense';
import jwt from'jsonwebtoken';
import middleware from'../middleware/auth';
import Razorpay from'razorpay';

var Brevo = require('@getbrevo/brevo');
// const Sbi= require('sib-api-v3-sdk');
import dot_env from'dotenv';
import FP from'../models/forgetPassword';
dot_env.config();


let userId:number=0;
router.post('/signup',async(req:any,res:any) => {
    const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password;
    
    
    const exist= await User.findOne({where: {email:email}});
    if(exist!=null){
        res.json({success: false,message:'already exists'});
    }
    else{
        const saltRounds=10;
        bcrypt.hash(password, saltRounds,async(err:any,hash:any) => {
        console.log(err);
        const newUser= await User.create({name:name,email:email,password:hash});
       // userId=newUser.id;
        res.json({success: true,message:'new user registered'});
       })
    }

})

function tokenCreation(userId:any,isPremiumUser:boolean)
{
    return jwt.sign({userId:userId,isPremiumUser},'secretKey');    ////////////////
}

router.post('/login',async(req:any,res:any)=>{
    const email= req.body.email;
    const password= req.body.password;

    const exist_email= await User.findOne({where: {email:email}});
    console.log(exist_email);
    
    if(exist_email==null){
        res.json({success:false, status:404, message:"User not found .... Please signup first"});
    }
    else{
        userId= exist_email.id;

        bcrypt.compare(password,exist_email.password,(err:any,result:any)=>{
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


router.post('/dailyExpense',middleware,async(req:any,res:any)=>{
    const date=req.body.date;
    const amount= req.body.amount;
    const description = req.body.description;
    const category= req.body.category;


    const expense= {
        date,amount,description,category
    }
    // const t= await sequelize.transaction();  
    req.user.createExpense(expense).then(async (response:any) => {

        const  total_expense= +req.user.totalExpense+ +amount;
        req.user.totalExpense=total_expense;
        await req.user.save();
    //    await t.commit();
        console.log(response);
        res.json(response);
    }).catch((err:any) => {
        //    t.rollback();
            console.error(err)
        });
})

router.get('/getExpense',middleware,(req:any,res:any) => {
    console.log("user")
    console.log(req.user)
    req.user.getExpenses().then((response:any)=>{ return res.json({response 
        , isPremiumUser : req.user.isPremiumUser}
        )}).catch((err:any) => {
        console.log(err)
    })
})


router.delete('/delete/:id',middleware,async(req:any,res:any) => {
    const expense_amount= await Expense.findAll({where:{id:req.params.id}});
    const user_totalExpense= await User.findAll({where:{id:req.params.id}})
    user_totalExpense.totalExpense= user_totalExpense.totalExpense-expense_amount.amount; 
    Expense.destroy({where:{id:req.params.id}})
    .then((response:any) =>{
        res.json({success: true, message:"deleted ->  ",response})})
    .catch((err:any) => { console.log(err) });
})

router.get('/premiumMembership',middleware,async(req:any, res:any) => {
    try{
        
        var rzp= new Razorpay({
            
            key_id: process.env.RAZORPAY_KEY_ID as string,
            key_secret: process.env.RAZORPAY_KEY_SECRET as string
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
    catch(err:any){

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

router.post('/updateTransaction',middleware,(req:any,res:any)=>{
    try{
        
        console.log("req.body",req.body);
        const {payment_id,order_id} = req.body;
        Order.findOne({where:{order_id:order_id}}).then(async (order:any) => {
            order.payment_id=payment_id;
            order.status="successful";
            await order.save();
            req.user.isPremiumUser=true;
            const token= tokenCreation(req.user.id,true);
           // const decodedToken= parseJwt(token);
            await req.user.save();

            return res.json({success:true,token,isPremiumUser:true});
            
        }).catch((err:any) =>{
            console.error(err);
        })
    }
    catch(err:any){
        console.error(err);
    }
})


router.post('/forgetPassword',async(req:any,res:any)=>{
    try{
        const rec_email = req.body.email;
        console.log(rec_email);
        const user = await User.findOne({where : {email : rec_email}})
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
        const link = await user.createFp();
        console.log("link",link);
        const response = await apiInstance.sendTransacEmail({
            sender,
            to : reciever,
            subject : 'testing',
            textContent: 'hello , this is a text content',
            htmlContent: '<p>Click the link to reset your password</p>'+
            `<a href="http://127.0.0.1:5500/frontend/Password/reset_password.html?reset=${link.id}">click here</a>`
        })
            await FP.update({isActive:true},{where:{id: link.id}});
            return res.json({success : true , response})

        }catch(e:any){
            console.log(e)
            return res.status(500).json({success : false ,msg :"Internal server error"})
        }
})

router.post('/update-password/:resetId',middleware,async(req:any,res:any) => {
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
    catch (err:any) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal Server error"});
    }


})

router.get('/check-password-link/:resetId',async(req:any, res:any) => {
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


export default router;

