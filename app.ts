const express = require('express');
const app = express();
const cors= require('cors');
const router= require('./routes/router');
const User= require('./models/user');
const Expense= require('./models/expense');
const sequelize= require('./util/db');
const Order= require('./models/order');
const premium= require('./routes/premium');
const FP= require('./models/forgetPassword');
const helmet= require('helmet');
const morgan= require('morgan');
const fs= require('fs');
const path = require('path');

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
}).catch(err => {
    console.error(err)
})