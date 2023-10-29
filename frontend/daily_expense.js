const ul= document.getElementById('ul');

window.addEventListener('load',async (req,res) => {   ///////NOT WORKING
    const token= localStorage.getItem('token');
    const all_expense= await axios.get('http://localhost:4000/user/getExpense',{headers: {'Authorization': token}});
    console.log("all_expenses",all_expense);
    all_expense.data.forEach(element => {
        displayExpense(element);
        
    });
    


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
    const token= localStorage.getItem('token');

   axios.post('http://localhost:4000/user/dailyExpense',expense , {headers: {'Authorization': token}}).then(response => {console.log(response)}).catch(err => {console.log(err)});

}

function displayExpense(expense){
    const li = document.createElement('li');
    console.log(expense);
    const span1= document.createElement('span');
    const span2= document.createElement('span');
    const span3= document.createElement('span');
    span1.textContent = expense.amount+"    ";
    span2.textContent = expense.description+"    ";
    span3.textContent = expense.category+"       ";

    li.appendChild(span1);
    li.appendChild(span2);
    li.appendChild(span3);

    const button= document.createElement('button');
    button.textContent = "DELETE";
    button.onclick  =()=>{
        axios.delete('http://localhost:4000/user/delete/' + expense.id)
        .then((res)=>{
            if(res.status == 200)
                ul.removeChild(li)
            
        })
        .catch(e => console.log(e))
    }
    li.appendChild(button);
    ul.appendChild(li);
}
