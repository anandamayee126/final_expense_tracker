"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const weekly_form = document.getElementById('monthly_form');
weekly_form.addEventListener('submit', showMonthly);
const token = localStorage.getItem('token');
const axios_1 = __importDefault(require("axios"));
async function showMonthly(e) {
    e.preventDefault();
    const date = e.target.date.value;
    console.log(date);
    const result = await axios_1.default.post('http://localhost:4000/premium/getMonthly', { date }, { headers: { "Authorization": token } });
    console.log("result_front", result);
    showReport(result);
}
function showReport(result) {
    const table = document.getElementById('table');
    const td_date = document.createElement('td');
    const td_amount = document.createElement('td');
    const td_description = document.createElement('td');
    const tr = document.createElement('tr');
    td_date.textContent = "Date";
    td_date.classList.add('td');
    td_amount.textContent = "Amount";
    td_amount.classList.add('td');
    td_description.textContent = "Description";
    td_description.classList.add('td');
    tr.appendChild(td_date);
    tr.appendChild(td_amount);
    tr.appendChild(td_description);
    table.appendChild(tr);
    result.data.forEach((expenses) => {
        const td_date_value = document.createElement('td');
        const td_amount_value = document.createElement('td');
        const td_description_value = document.createElement('td');
        const tr_value = document.createElement('tr');
        td_date_value.textContent = expenses.date;
        td_amount_value.textContent = expenses.amount;
        td_description_value.textContent = expenses.description;
        tr_value.appendChild(td_date_value);
        tr_value.appendChild(td_amount_value);
        tr_value.appendChild(td_description_value);
        table.appendChild(tr_value);
    });
    const download_btn = document.createElement('button');
    download_btn.textContent = 'Download Report';
    download_btn.name = "download";
    // const token= localStorage.getItem('token');
    download_btn.onclick = () => {
        axios_1.default.post('http://localhost:4000/premium/downloadExpense', { data: result.data }, { headers: { 'Authorization': token } })
            .then((response) => {
            console.log("response", response);
        })
            .catch((error) => {
            console.log(error);
        });
    };
    table.appendChild(download_btn);
}
