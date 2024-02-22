// // // const Sequelize = require( 'sequelize');
// // // const sequelize = require( '../util/db');
// // // const Order= sequelize.define('order',{
// // //     id:{
// // //         type: Sequelize.INTEGER,
// // //         allowNull: false,
// // //         autoIncrement: true,
// // //         primaryKey: true
// // //     },
// // //     payment_id:Sequelize.STRING,
// // //     order_id:Sequelize.STRING,
// // //     status: Sequelize.STRING
// // // })

// // import getDb from '../utils/db').getDb;
// // import mongo= require('mongodb');
// class Order{
//   constructor(id,payment_id,status){
//     this.userId=id;
//     this.payment_id=payment_id;
//     this.status=status;
//   }
// //   save(){
// //     const db= getDb();
// //     return db.collection('order').insertOne(this).then((result) =>{
// //         console.log("line 41 of order model",result);
// //         return result;
// //     }).catch((err) =>{
// //         console.log(err);
// //     })}
// //     static findOne(orderId){
// //       const db= getDb();
// //       return db.collection('order').find({"_id":orderId}).toArray().then((res)=>{
// //         console.log("line 34 of order model",res);
// //         return res;
// //       }).catch((err)=>{
// //         console.log(err);
// //       })
// //     }
// //     static update(userId,paymentId,status){
// //       const db= getDb();
// //       return db.collection('order').updateOne({userId:userId},{$set:{payment_id:paymentId,status:status}}).then((res)=>{
// //         console.log("line 42 of order model",res);
// //         return res;
// //       }).catch((err)=>{
// //         console.log(err);
// //       })

// //     }
// }

// export default Order;


import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
// mongoose.connect('mongodb+srv://andy:JuOupNWAcOMRmnAP@exp.1rbyylg.mongodb.net/')
const OrderSchema= new mongoose.Schema({
    userId:ObjectId,
    paymentId:String,
    status:String
})

export const Order=mongoose.model('order',OrderSchema);