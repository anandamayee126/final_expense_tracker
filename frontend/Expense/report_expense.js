const weekly= document.getElementById('weekly');
const monthly= document.getElementById('monthly');
const daily= document.getElementById('daily');

daily.addEventListener('click',showDaily);
weekly.addEventListener('click',showWeekly);
monthly.addEventListener('click',showMonthly);

async function showDaily(e)
{
    e.preventDefault();
    window.location="daily_report.html";
    
}
async function showWeekly(e)
{
    e.preventDefault();
    window.location="weekly_expense.html";
    
}
async function showMonthly(e){
    e.preventDefault();
    // const token= localStorage.getItem('token');
    window.location="monthly_expense.html";

}