const getDb= require('../utils/db').getDb;
class User{
    constructor(id,name,email,password,isPremiumUser,totalExpense){
        this.id=id;
        this.name=name;
        this.email=email;
        this.password=password;
        this.isPremiumUser=isPremiumUser;
        this.totalExpense=totalExpense;
    }
    save(){
        const db= getDb();
        return db.collection('users').insertOne(this).then((result)=>{
            console.log(result);
        }).catch((err)=>{
            console.log(err);
        })
    }
    static findOne(email){
        const db= getDb();
        return db.collection('users').find({email:email}).toArray().then((user)=>{   //find() returns a cursor object which helps to handle the data 
            console.log(user);
            return user;   /////// need to understand

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