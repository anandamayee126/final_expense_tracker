const express = require('express');
const app = express();
const cors= require('cors');
const router= require('./routes/router');
const User= require('./models/user_db');
const Expense= require('./models/expense_db');
const sequelize= require('./util/db');

app.use(cors());
app.use(express.json());

User.hasMany(Expense);
Expense.belongsTo(User);

app.use('/user',router);

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