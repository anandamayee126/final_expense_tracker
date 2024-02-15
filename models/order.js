// const Sequelize = require( 'sequelize');
// const sequelize = require( '../util/db');
// const Order= sequelize.define('order',{
//     id:{
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     payment_id:Sequelize.STRING,
//     order_id:Sequelize.STRING,
//     status: Sequelize.STRING
// })

const getDb= require('../utils/db').getDb;
const mongo= require('mongodb');
class Order{
  constructor(id,payment_id,order_id,status){
    this.userId=id;
    this.payment_id=payment_id;
    this.order_id=order_id;
    this.status=status;
  }
  save(){
    const db= getDb();
    return db.collection('order').insertOne(this).then((result) =>{
        console.log("line 41 of order model",result);
        return result;
    }).catch((err) =>{
        console.log(err);
    })}
}

module.exports = Order;