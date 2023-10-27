const form= document.getElementById('daily_expense');
form.addEventListener('submit', addDailyExpense);

function addDailyExpense(e){
    const amount=e.target.amount.value;
    const description= e.target.description.value;
    const category= e.target.category.value;

    const expense={
        amount,description,category
    }

    const addExpense= axios.post('http://localhost:4000/user/dailyExpense',expense).then(response => {console.log(response)}).catch(err => {console.log(err)});

}