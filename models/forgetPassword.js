// const Sequelize = require('sequelize');
// const sequelize = require('../util/db');
// const FP= sequelize.define('fp',{
//     id:{
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     isActive:{
//         type: Sequelize.BOOLEAN,
//         defaultValue: true
//     }
// })
const getDb= require('../utils/db').getDb;
const mongo= require('mongodb');
class FP{
  constructor(id,isActive){
    this.userId=id;
    this.isActive=isActive;
  }
  save(){
    const db= getDb();
    return db.collection('fp').insertOne(this).then((result) =>{
        console.log("line 25 of fp model",result);
        return result;
    }).catch((err) =>{
        console.log(err);
    })

  }

}
module.exports= FP;