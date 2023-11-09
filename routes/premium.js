const express= require('express');
const premium= express();
const middleware= require('../middleware/auth');
const User= require('../models/user');
const Expense= require('../models/expense');
const sequelize= require('sequelize');



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
module.exports= premium;