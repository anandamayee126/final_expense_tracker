import express from 'express';
import mongoose from 'mongoose';
let mongoConnect= await mongoose.connect('mongodb+srv://andy:JuOupNWAcOMRmnAP@exp.1rbyylg.mongodb.net/');
console.log("connect",mongoConnect);

const app = express();
import cors from 'cors';
import router from './routes/router.js';
import {User} from './models/user.js';
import {Expense} from './models/expense.js';
import {Order} from './models/order.js';
import premium from './routes/premium.js';
import {FP} from './models/forgetPassword.js';
// const helmet= from('helmet');
// const morgan= from('morgan');
// const fs= from('fs');
// const path= from('path');

app.use(cors());
app.use(express.json());

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(FP);
// FP.belongsTo(User);

app.use('/user',router);
app.use('/premium',premium)

// const accessLogStream= fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
// User.create({
//     name:'Anandamayee',
//     email:'anandamayee@gmail.com',
//     password:'12345'
// }).then((response) => {
//     console.log(response);
// }).catch((err) => {
//     console.log(err);
// })
// app.use(helmet());
// app.use(morgan('combined',{stream: accessLogStream}));

// app.use(express.static(path.join(__dirname , 'frontend')))

// sequelize.sync().then(()=>{
//     app.listen(4000);
// }).catch((err) => {
//     console.error(err)
// })

app.listen(4000,()=>{
    console.log("mongoose connected");
})