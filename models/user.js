const getDb= require('../util/db').getDb;
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
        
    }
}
const User= sequelize.define('user',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    isPremiumUser:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    totalExpense:{
        type: Sequelize.INTEGER,
        defaultValue:0
    }
})

module.exports= User;