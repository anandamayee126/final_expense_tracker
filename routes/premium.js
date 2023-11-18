const express= require('express');
const premium= express();
const middleware= require('../middleware/auth');
const User= require('../models/user');
const Expense= require('../models/expense');
const sequelize= require('sequelize');
const AWS= require('aws-sdk');



premium.get('/showLeaderboard',middleware,async(req,res)=>{
    const result = await User.findAll({
        attributes :[
            'id',
            'name',
            [sequelize.fn('COALESCE',sequelize.literal('SUM(`expenses`.`amount`)'),0),'total_expense'],
        ],
        include:[
            {
                model : Expense,
                attributes :[]
            }
        ],
        group : [`User.id`],
        order : [[sequelize.literal('total_expense'), 'DESC']]
    })
    return res.json(result)
    

})


premium.get('/checkPremium' , middleware , async(req,res)=>{
    try{
        return res.json({success: true , isPremiumUser : req.user.isPremiumUser})
    }catch(e){
        return res.status(500).json({success: false , msg:"Intenal server error"})

    }
})

function uploadToS3(data,fileName)
{
    const BUCKET_NAME = "";
    const IAM_USER_KEY ="";
    const IAM_USER_SECRET = "";

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    s3bucket.createBucket(()=>{
        var params={
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: data
        }
        s3bucket.upload(params,(err,s3Response)=>{
            if(err){
                console.log("Something is Wrong",err);
            }
            else{
                console.log("Success",s3Response);
            }
        })
    })
}

premium.get('/downloadExpense',middleware, async(req, res) => {
    try{
        const expenses= req.user.getExpenses();
        console.log("expenses are: ",expenses);
        const stringifiedExpenses= JSON.stringify(expenses);
        conole.log("stringifiedExpenses ",stringifiedExpenses);
        const fileName= "Expense.txt";
        const fileUrl= await uploadToS3(stringifiedExpenses,fileName);
        res.status(200).json({fileUrl , success : true});
    }
    catch(err){
        res.status(500).json({success:false,message:err.message});
    }
    



})
module.exports= premium;