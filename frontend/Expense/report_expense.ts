const weekly= document.getElementById('weekly') as HTMLButtonElement;
const monthly= document.getElementById('monthly') as HTMLButtonElement;
const daily= document.getElementById('daily') as HTMLButtonElement;

daily.addEventListener('click',showDaily);
weekly.addEventListener('click',showWeekly);
monthly.addEventListener('click',showMonthly);

async function showDaily(e:any)
{
    e.preventDefault();
    window.location="daily_report.html" as (string & Location);
    
}
async function showWeekly(e:any)
{
    e.preventDefault();
    window.location="weekly_expense.html" as (string & Location);
    
}
async function showMonthly(e:any){
    e.preventDefault();
    // const token= localStorage.getItem('token');
    window.location="monthly_expense.html" as (string & Location);

}