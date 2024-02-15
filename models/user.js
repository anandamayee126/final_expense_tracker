const getDb= require('../utils/db').getDb;
const mongo = require('mongodb');
class User{
    constructor(name,email,password,isPremiumUser,totalExpense){
        // this.id=new mongo.ObjectId();
        this.name=name;
        this.email=email;
        this.password=password;
        this.isPremiumUser=isPremiumUser;
        this.totalExpense=totalExpense;
    }
    save(){
        const db= getDb();
        return db.collection('user').insertOne(this).then((result)=>{
            console.log(result);
            return result
        }).catch((err)=>{
            console.log(err);
        })
    }
    static findOne(email){
        // console.log(id);
        // console.log(new mongo.ObjectId(id));
        const db= getDb();
        return db.collection('user').find({email:email}).toArray().then((user)=>{   //find() returns a cursor object which helps to handle the data 
            console.log(user[0]);
            return user[0]; 
        }).catch((err)=>{
            console.log(err);
            return err;

        })
    }
    static findId(id){
        console.log(id);
        console.log(new mongo.ObjectId(id));
        const db= getDb();
        return db.collection('user').find({"_id":new mongo.ObjectId(id)}).toArray().then((user)=>{   //find() returns a cursor object which helps to handle the data 
            console.log(user);
            console.log("line 40")
            return user[0];   /////// need to understand

        }).catch((err)=>{
            console.log(err);
            return err;

        })
    }
    
    
}
// const User= sequelize.define('user',{
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name:{
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     email:{
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     password:{
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     isPremiumUser:{
//         type: Sequelize.BOOLEAN,
//         defaultValue: false
//     },
//     totalExpense:{
//         type: Sequelize.INTEGER,
//         defaultValue:0
//     }
// })

module.exports= User;