"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = __importDefault(require("../models/user"));
const order_1 = __importDefault(require("../models/order"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const expense_1 = __importDefault(require("../models/expense"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
const razorpay_1 = __importDefault(require("razorpay"));
var Brevo = require('@getbrevo/brevo');
// const Sbi= require('sib-api-v3-sdk');
const dotenv_1 = __importDefault(require("dotenv"));
const forgetPassword_1 = __importDefault(require("../models/forgetPassword"));
dotenv_1.default.config();
let userId = 0;
router.post('/signup', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const exist = await user_1.default.findOne({ where: { email: email } });
    if (exist != null) {
        res.json({ success: false, message: 'already exists' });
    }
    else {
        const saltRounds = 10;
        bcrypt_1.default.hash(password, saltRounds, async (err, hash) => {
            console.log(err);
            const newUser = await user_1.default.create({ name: name, email: email, password: hash });
            // userId=newUser.id;
            res.json({ success: true, message: 'new user registered' });
        });
    }
});
function tokenCreation(userId, isPremiumUser) {
    return jsonwebtoken_1.default.sign({ userId: userId, isPremiumUser }, 'secretKey'); ////////////////
}
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const exist_email = await user_1.default.findOne({ where: { email: email } });
    console.log(exist_email);
    if (exist_email == null) {
        res.json({ success: false, status: 404, message: "User not found .... Please signup first" });
    }
    else {
        userId = exist_email.id;
        bcrypt_1.default.compare(password, exist_email.password, (err, result) => {
            if (err) {
                res.json({ success: false, message: "Something went wrong" });
            }
            else if (result === true) {
                return res.json({ success: true, message: "User login successfull", token: tokenCreation(userId, exist_email.isPremiumUser) });
            }
            else {
                res.status(403).json({ success: false, message: "incorrect password" });
            }
        });
    }
});
router.post('/dailyExpense', auth_1.default, async (req, res) => {
    const date = req.body.date;
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const expense = {
        date, amount, description, category
    };
    // const t= await sequelize.transaction();  
    req.user.createExpense(expense).then(async (response) => {
        const total_expense = +req.user.totalExpense + +amount;
        req.user.totalExpense = total_expense;
        await req.user.save();
        //    await t.commit();
        console.log(response);
        res.json(response);
    }).catch((err) => {
        //    t.rollback();
        console.error(err);
    });
});
router.get('/getExpense', auth_1.default, (req, res) => {
    console.log("user");
    console.log(req.user);
    req.user.getExpenses().then((response) => {
        return res.json({ response,
            isPremiumUser: req.user.isPremiumUser });
    }).catch((err) => {
        console.log(err);
    });
});
router.delete('/delete/:id', auth_1.default, async (req, res) => {
    const expense_amount = await expense_1.default.findAll({ where: { id: req.params.id } });
    const user_totalExpense = await user_1.default.findAll({ where: { id: req.params.id } });
    user_totalExpense.totalExpense = user_totalExpense.totalExpense - expense_amount.amount;
    expense_1.default.destroy({ where: { id: req.params.id } })
        .then((response) => {
        res.json({ success: true, message: "deleted ->  ", response });
    })
        .catch((err) => { console.log(err); });
});
router.get('/premiumMembership', auth_1.default, async (req, res) => {
    try {
        var rzp = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const options = {
            amount: 2500,
            currency: "INR"
        };
        const order = await rzp.orders.create(options);
        console.log("order", order);
        // if(err){
        //         console.log(err);
        //     }
        //console.log(req.user)
        await req.user.createOrder({ order_id: order.id, status: "PENDING" });
        //    await Order.create({order_id : order.id , status :"PENDING",userId :userId}) //
        return res.status(201).json({ order, key_id: rzp.key_id });
    }
    catch (err) {
        console.log(err);
    }
});
// function parseJwt (token) {
//         var base64Url = token.split('.')[1];
//         var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
//             return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//         }).join(''));
//         return JSON.parse(jsonPayload);
//     }
router.post('/updateTransaction', auth_1.default, (req, res) => {
    try {
        console.log("req.body", req.body);
        const { payment_id, order_id } = req.body;
        order_1.default.findOne({ where: { order_id: order_id } }).then(async (order) => {
            order.payment_id = payment_id;
            order.status = "successful";
            await order.save();
            req.user.isPremiumUser = true;
            const token = tokenCreation(req.user.id, true);
            // const decodedToken= parseJwt(token);
            await req.user.save();
            return res.json({ success: true, token, isPremiumUser: true });
        }).catch((err) => {
            console.error(err);
        });
    }
    catch (err) {
        console.error(err);
    }
});
router.post('/forgetPassword', async (req, res) => {
    try {
        const rec_email = req.body.email;
        console.log(rec_email);
        const user = await user_1.default.findOne({ where: { email: rec_email } });
        console.log(user);
        console.log(user == null);
        if (user === null)
            return res.status(404).json({ success: false, msg: "Email not found" });
        var defaultClient = Brevo.ApiClient.instance;
        var apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;
        var apiInstance = new Brevo.TransactionalEmailsApi();
        const sender = { "email": "anandamayee.2000@gmail.com" };
        const reciever = [{
                "email": rec_email
            }];
        const link = await user.createFp();
        console.log("link", link);
        const response = await apiInstance.sendTransacEmail({
            sender,
            to: reciever,
            subject: 'testing',
            textContent: 'hello , this is a text content',
            htmlContent: '<p>Click the link to reset your password</p>' +
                `<a href="http://127.0.0.1:5500/frontend/Password/reset_password.html?reset=${link.id}">click here</a>`
        });
        await forgetPassword_1.default.update({ isActive: true }, { where: { id: link.id } });
        return res.json({ success: true, response });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
});
router.post('/update-password/:resetId', auth_1.default, async (req, res) => {
    try {
        const id = req.params.resetId;
        const newPassword = req.body.newPassword;
        const resetUser = await forgetPassword_1.default.findByPk(id);
        const user_id = resetUser.userId;
        console.log("user_id", user_id);
        if (!(resetUser.isActive)) {
            return res.json({ success: false, msg: "Link has expired... Please try again" });
        }
        const user = resetUser.getUser();
        const hash = await bcrypt_1.default.hash(newPassword, 10);
        await user_1.default.update({ password: hash }, { where: { id: user_id } });
        await forgetPassword_1.default.update({ isActive: false }, { where: { id: id } });
        return res.status(200).json({ success: true, message: "Password updated successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
});
router.get('/check-password-link/:resetId', async (req, res) => {
    try {
        const id = req.params.resetId;
        const find = await forgetPassword_1.default.findOne({ where: { id: id } });
        return res.json({ isActive: find.isActive });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error!!" });
    }
});
exports.default = router;
