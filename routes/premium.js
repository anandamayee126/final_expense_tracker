const express= require('express');
const premium= express();
const middleware= require('../middleware/auth');
const User= require('../models/user');
const Expense= require('../models/expense');
const sequelize= require('sequelize');



premium.get('/showLeaderboard',middleware,async(req,res)=>{
    var total_expense={};
    const users=await User.findAll({
        attributes:['id','name']
    });
    const expenses= await Expense.findAll({
        attributes:['userId',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_expense']]
    });
    var leaderBoard=[];
    // expenses.forEach(expense=>{
    //     if(total_expense[expense.userId]){
    //         total_expense[expense.userId]+=expense.amount;
    //     }
    //     else{
    //         total_expense[expense.userId]=expense.amount;
    //     }
    // })

    users.forEach(user => {
        leaderBoard[user.id].push({name:user.name,total_expense:total_expense[user.id]});
    })
    res.status(200).json({success:true});

})
module.exports= premium;