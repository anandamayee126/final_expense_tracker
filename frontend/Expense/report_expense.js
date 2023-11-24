const weekly= document.getElementById('weekly');
const monthly= document.getElementById('monthly');


weekly.addEventListener('click',showWeekly);
monthly.addEventListener('click',showMonthly);

async function showWeekly(e)
{
    e.preventDefault();
    window.location="weekly_expense.html";
    
}
async function showMonthly(e){
    e.preventDefault();
    const token= localStorage.getItem('token');
    window.location="monthly_expense.html";

}