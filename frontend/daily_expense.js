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



function showLeaderboard() {
    const leaderboard= document.createElement('input');
    leaderboard.type="button";
    leaderboard.value="Show Leaderboard";
    leaderboard.onclick= async()=>{
        const token=localStorage.getItem('token');
        const userLeaderboard= await axios.get('http://localhost:4000/premium/showLeaderboard',{header:{"Authorization":token}});


        console.log("userLeaderboard",userLeaderboard);

        var leaderboardElem= document.getElementById('leaderboard');
        leaderboardElem.append(leaderboard);
        leaderboardElem.innerHTML+='<h1>Leader Board</h1>';
        userLeaderboard.data.forEach((user) => {
            leaderboardElem.innerHTML+=`<li> Name--${user.name} Total Expense--${user.total_expense}</li>`
        })
    }
}

const razor= document.getElementById('razor');
razor.onclick= async function(e){
    const token= localStorage.getItem('token');
    const response= await axios.get('http://localhost:4000/user/premiumMembership',{headers:{"Authorization":token}});
    console.log("response",response);
    var options={
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler":async function(response){
           const result= await axios.post('http://localhost:4000/user/updateTransaction',{
            order_id:options.order_id,
            payment_id:response.razorpay_payment_id,  

        }, {headers:{"Authorization":token}})

        console.log(result);
        alert("You are a premium user now");
        localStorage.setItem('token',result.data.token);
        const isPremiumUser=true;
        if(isPremiumUser) {
            console.log("hiiii");
            document.getElementById('razor').style.visibility="hidden";
            document.getElementById('p').innerHTML="You are a premium user";
            showLeaderboard();
        }
        },
    };
    const rzp1= new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',function(response){
        console.log(response);
        alert("Something went wrong");
    }); 
}