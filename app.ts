import express from 'express';
const app = express();
import cors from 'cors';
import router from './routes/router.js';
import User from './models/user.js';
import Expense from'./models/expense.js';
import sequelize from './util/db.js';
const Order= require('./models/order');
const premium= require('./routes/premium');
const FP= require('./models/forgetPassword');
const helmet= require('helmet');
const morgan= require('morgan');
import fs from 'fs';
import path from 'path';

app.use(cors());
app.use(express.json());

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(FP);
FP.belongsTo(User);

app.use('/user',router);
app.use('/premium',premium)

const accessLogStream= fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
// User.create({
//     name:'Anandamayee',
//     email:'anandamayee@gmail.com',
//     password:'12345'
// }).then((response) => {
//     console.log(response);
// }).catch((err) => {
//     console.log(err);
// })
app.use(helmet());
app.use(morgan('combined',{stream: accessLogStream}));

sequelize.sync().then(()=>{
    app.listen(4000);
}).catch((err:any) => {
    console.error(err)
})