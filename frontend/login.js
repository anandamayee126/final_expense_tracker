"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login = document.getElementById('login');
login.addEventListener('submit', checkUser);
const axios_1 = __importDefault(require("axios"));
async function checkUser(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const user = {
        name, email, password
    };
    const login = await axios_1.default.post('http://localhost:4000/user/login', user);
    console.log("login", login);
    if (login.data.success === true) {
        localStorage.setItem('token', login.data.token);
        window.location = "/frontend/Expense/daily_expense.html";
    }
    else {
        const p = document.getElementById('Incorrect_password');
        p.classList.remove('hide');
        // window.location="login.html";
    }
}
