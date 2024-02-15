const getDb= require('../utils/db').getDb;
const mongo= require('mongodb');
class Expense{
    constructor(id,date,amount,description,category){
        this.userId=id;
        this.date = date;
        this.amount = amount;
        this.description = description;
        this.category = category;

    }
    save(){
        const db=getDb();
        return db.collection('expense').insertOne(this).then((result) =>{
            console.log(result)
        }).catch((err) =>{
            console.log(err)
        })
    }
    static getExpense(id, offset , limit){
        const db=getDb();
        console.log("line 21 of expense model");
        return db.collection('expense').find({_id:new mongo.ObjectId(id)}).skip(+offset).limit(+limit).toArray().then((expense) =>{
            console.log("expenses are: ",expense);
        }).catch((err) =>{
            console.log("error: ",err);
        })

    }

    static ifPremiumUser(id){
        const db=getDb();
        return db.collection('expense').find({_id:new mongo.ObjectId(id)}).toArray().then((expense) =>{
           if(expense.isPremiumUser){
            return true;

           }
           return false;
        }).catch((err) =>{
            console.log("error: ",err);
        })
    }

    static destroy(id){
        const db=getDb();
        return db.collection('expense').remove(id).then((res) =>{
            console.log("deleted",res);
        }).catch((err) =>{
            console.log("error: ",err);
        })
    }

    static countExpenses(id){
        const db=getDb();
        return db.collection('expense').count({userId:id}).then((res) =>{
            console.log("count expenses res",res);
            return res;
        }).catch((err) =>{
            console.log(err);
        })
    }
    
}

module.exports= Expense;


// const Sequelize = require('sequelize');
// const sequelize = require('../util/db');
// const Expense= sequelize.define('expense',{
//     id:{
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     date:{
//         type: Sequelize.DATEONLY,
//         allowNull: false,

//     },
//     amount:{
//         type: Sequelize.INTEGER,
//         allowNull: false,
//     },
//     description:{
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     category:{
//         type: Sequelize.STRING,
//         allowNull: false,
//     }
// })

// module.exports= Expense;

