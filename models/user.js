// const getDb= require('../utils/db').getDb;
// const mongo = require('mongodb');
// class User{
//     constructor(name,email,password,isPremiumUser,totalExpense){
//         // this.id=new mongo.ObjectId();
//         this.name=name;
//         this.email=email;
//         this.password=password;
//         this.isPremiumUser=isPremiumUser;
//         this.totalExpense=totalExpense;
//     }
//     save(){
//         const db= getDb();
//         return db.collection('user').insertOne(this).then((result)=>{
//             console.log(result);
//             return result
//         }).catch((err)=>{
//             console.log(err);
//         })
//     }
//     static findOne(email){
//         // console.log(id);
//         // console.log(new mongo.ObjectId(id));
//         const db= getDb();
//         return db.collection('user').find({email:email}).toArray().then((user)=>{   //find() returns a cursor object which helps to handle the data 
//             console.log(user[0]);
//             return user[0]; 
//         }).catch((err)=>{
//             console.log(err);
//             return err;

//         })
//     }
//     static findId(id){
//         console.log("findid",id);
//         console.log(new mongo.ObjectId(id));
//         const db= getDb();
//         return db.collection('user').find({_id:new mongo.ObjectId(id)}).toArray().then((user)=>{   //find() returns a cursor object which helps to handle the data 
//             console.log(user);
//             console.log("line 40",user[0]);
//             return user[0];   /////// need to understand

//         }).catch((err)=>{
//             console.log(err);
//             return err;

//         })
//     }
//     static updatePremium(id,isPremiumUser){
//         const db= getDb();
//         return db.collection('user').updateOne({_id:id},{$set:{isPremiumUser:isPremiumUser}}).then((res)=>{
//             console.log("line 51 of user model",res);
//             return res;
//           }).catch((err)=>{
//             console.log(err);
//           })
//     }
//     static updateExpense(id,totalExpense){
//         const db= getDb();
//         return db.collection('user').updateOne({_id:id},{$set:{totalExpense:totalExpense}}).then((res)=>{
//             console.log("line 51 of user model",res);
//             return res;
//           }).catch((err)=>{
//             console.log(err);
//           })
//     }
    
    
// }
// // const User= sequelize.define('user',{
// //     id:{
// //         type: Sequelize.INTEGER,
// //         autoIncrement: true,
// //         allowNull: false,
// //         primaryKey: true
// //     },
// //     name:{
// //         type: Sequelize.STRING,
// //         allowNull: false
// //     },
// //     email:{
// //         type: Sequelize.STRING,
// //         allowNull: false
// //     },
// //     password:{
// //         type: Sequelize.STRING,
// //         allowNull: false
// //     },
// //     isPremiumUser:{
// //         type: Sequelize.BOOLEAN,
// //         defaultValue: false
// //     },
// //     totalExpense:{
// //         type: Sequelize.INTEGER, 
// //         defaultValue:0
// //     }
// // })

// module.exports= User;

import mongoose from 'mongoose';
// mongoose.connect('mongodb+srv://andy:JuOupNWAcOMRmnAP@exp.1rbyylg.mongodb.net/')
const UserSchema= new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    isPremiumUser:Boolean,
    totalExpense:Number
})

export const User=mongoose.model('user',UserSchema);