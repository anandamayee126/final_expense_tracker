const getDb= require('../utils/db').getDb;
class Expense{
    constructor(date,amount,description,category){
        this.date = date;
        this.amount = amount;
        this.description = description;
        this.category = category;
    }
    save(){
        const db=getDb();
        return db.collection('expenses').insertOne(this).then((result) =>{
            console.log(result)
        }).catch((err) =>{
            console.log(err)
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

