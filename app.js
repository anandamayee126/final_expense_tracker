"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const router_js_1 = __importDefault(require("./routes/router.js"));
const user_js_1 = __importDefault(require("./models/user.js"));
const expense_js_1 = __importDefault(require("./models/expense.js"));
const db_js_1 = __importDefault(require("./util/db.js"));
const Order = require('./models/order');
const premium = require('./routes/premium');
const FP = require('./models/forgetPassword');
const helmet = require('helmet');
const morgan = require('morgan');
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
user_js_1.default.hasMany(expense_js_1.default);
expense_js_1.default.belongsTo(user_js_1.default);
user_js_1.default.hasMany(Order);
Order.belongsTo(user_js_1.default);
user_js_1.default.hasMany(FP);
FP.belongsTo(user_js_1.default);
app.use('/user', router_js_1.default);
app.use('/premium', premium);
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, 'access.log'), { flags: 'a' });
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
app.use(morgan('combined', { stream: accessLogStream }));
db_js_1.default.sync().then(() => {
    app.listen(4000);
}).catch((err) => {
    console.error(err);
});
