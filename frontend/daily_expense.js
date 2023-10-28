window.addEventListener('load',(req,res) => {
    const all_expense= axios.get('http://localhost:4000/user').then((expense) => {
        console.log(expense);
        

    })
    


})


const form= document.getElementById('daily_expense');
form.addEventListener('submit', addDailyExpense);

function addDailyExpense(e){
    e.preventDefault();
    const amount=e.target.amount.value;
    const description= e.target.description.value;
    const category= e.target.category.value;

    const expense={
        amount,description,category
    }

    const addExpense= axios.post('http://localhost:4000/user/dailyExpense',expense).then(response => {console.log(response)}).catch(err => {console.log(err)});

}

function displayExpense(expense) {

}