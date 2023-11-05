const express = require('express');
const app = express();
const cors= require('cors');
const router= require('./routes/router');
const User= require('./models/user');
const Expense= require('./models/expense');
const sequelize= require('./util/db');
const Order= require('./models/order');
const premium= require('./routes/premium');

app.use(cors());
app.use(express.json());

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

app.use('/user',router);
app.use('/premium',premium)

// User.create({
//     name:'Anandamayee',
//     email:'anandamayee@gmail.com',
//     password:'12345'
// }).then((response) => {
//     console.log(response);
// }).catch((err) => {
//     console.log(err);
// })

sequelize.sync().then(()=>{
    app.listen(4000);
}).catch(err => {
    console.error(err)
})