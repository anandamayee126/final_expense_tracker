const ul= document.getElementById('ul')
var date_val=null;
// import axios from 'axios';
const show_leaderBoard= document.getElementById('showleaderboard')
const razor_pay=document.getElementById('razor')
// const Razorpay= require('razorpay');

window.addEventListener('load',async () => {   ///////NOT WORKING  ///////NOT WORKING
    const token= localStorage.getItem('token');
    const all_expense= await axios.get('http://54.90.219.176:4000/user/getExpense',{headers: {'Authorization': token}});
    console.log("all_expenses",all_expense);
    if(all_expense.data.isPremiumUser){
        show_leaderBoard.classList.remove('hide')
        razor_pay.classList.add('hide')
    }
     renderElements()
    // all_expense.data.response.forEach((element) => {
    //     displayExpense(element);
    });
    


// })

const form= document.getElementById('daily_expense')
form.addEventListener('submit', addDailyExpense);
function addDailyExpense(e){
    e.preventDefault();
    window.location.href=window.location.href;
    console.log("inside addDailyExpense");
    const date= e.target.date.value;
    date_val= date;
    const amount=e.target.amount.value;
    const description= e.target.description.value;
    const category= e.target.category.value;

    const expense={
        date,amount,description,category
    }
    const token= localStorage.getItem('token');

    axios.post('http://54.90.219.176:4000/user/dailyExpense',expense , {headers: {'Authorization': token}}).then(response => {console.log(response)}).catch(err => {console.log(err)});

}


async function renderElements() {
    if (localStorage.getItem('token') == undefined)
        window.location = "../login.html"

    console.log(localStorage.getItem("isPremiumUser"))

    // axiosInstance.setHeaders({});
    const ITEMS_PER_PAGE = +localStorage.getItem('totalItems') || 5
    console.log(ITEMS_PER_PAGE)
    document.getElementById('pages').value = ITEMS_PER_PAGE 
    let result = await axios.post('http://54.90.219.176:4000/user/get-expense' , {items : ITEMS_PER_PAGE} , {headers :{
        'Authorization' : localStorage.getItem('token')
    }})
    console.log(result)
    if(ITEMS_PER_PAGE > result.data.totalExpenses){
        console.log(result.data.totalExpenses)
        document.getElementById('next').classList.add('hide')
    }else{
        document.getElementById('next').classList.remove('hide')
        console.log(result.data.totalExpenses)
    }
    let users = result.data.expenses;
    ul.innerHTML = ``
    users.forEach((value) => {
        displayExpense(value)
        // ul.appendChild(li)
})
}
function displayExpense(expense){
    const li = document.createElement('li');
    console.log(expense);
    const span1= document.createElement('span');
    const span2= document.createElement('span');
    const span3= document.createElement('span');
    const span4= document.createElement('span');

    span4.textContent = expense.date+"    ";
    span1.textContent = expense.amount+"    ";
    span2.textContent = expense.description+"    ";
    span3.textContent = expense.category+"       ";

    li.appendChild(span4);
    li.appendChild(span1);
    li.appendChild(span2);
    li.appendChild(span3);

    const button= document.createElement('button');
    button.textContent = "DELETE";
    const token= localStorage.getItem('token');
    button.onclick  =()=>{

        axios.delete('http://54.90.219.176:4000/user/delete/' + expense.id,{headers: {'Authorization': token}})
        .then((res)=>{
            if(res.status == 200)
                ul.removeChild(li)
        })
        .catch(e => console.log(e))
    }
    li.appendChild(button);
    ul.appendChild(li);

    date_val= expense.date;
}


show_leaderBoard.addEventListener('click' , showLeaderboard)
    async function showLeaderboard(){
        const token=localStorage.getItem('token');
        console.log(token)
        const userLeaderboard= await axios.get('http://54.90.219.176:4000/premium/showLeaderboard',{headers:{"Authorization":token}});
        console.log("userLeaderboard",userLeaderboard);
        var leaderboard_UL= document.getElementById('leaderboard')
        leaderboard_UL.innerHTML+='<h1>Leader Board</h1>';
        userLeaderboard.data.forEach((user) => {
            const leaderboard_LI= document.createElement('li');
            leaderboard_LI.innerText=`Name--${user.name} Total Expense--${user.total_expense}`
            leaderboard_UL.appendChild(leaderboard_LI);
        })
    }


razor_pay.onclick= async function(e){
    const token= localStorage.getItem('token');
    const response= await axios.get('http://54.90.219.176:4000/user/premiumMembership',{headers:{"Authorization":token}});
    console.log("response",response);
    var options={
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler":async function(response){
           const result= await axios.post('http://54.90.219.176:4000/user/updateTransaction',{
            order_id:options.order_id,
            payment_id:response.razorpay_payment_id,  

        }, {headers:{"Authorization":token}})

        console.log(result);
        alert("You are a premium user now");
        localStorage.setItem('token',result.data.token);
        const isPremiumUser=true;
        if(isPremiumUser) {
            console.log("hiiii");
            show_leaderBoard.classList.remove('hide')
            razor_pay.classList.add('hide')
            showLeaderboard();
        }
        },// ispremium : true / false
    };
    const rzp1= new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',function(response){
        console.log(response);
        alert("Something went wrong");
    }); 
}

//pagination

document.getElementById('pages').addEventListener('change',async(e)=>{
    try{
        const page= e.target.value;
        localStorage.setItem('totalItems',page);
        renderElements();
    }catch(e){
        console.log(e);
    }
})

document.querySelector('.page').addEventListener('click' , async(e)=>{
    try{
        const items = +localStorage.getItem('totalItems') || 5  ///////////////////
        if(e.target.classList.contains('page-btn')){
            console.log('clicked')
            console.log(e.target.id == 'next')
            const page = e.target.value
            const result = await axios.post(`http://54.90.219.176:4000/user/get-expense/?page=${page}` , {items} , {headers:{'Authorization': localStorage.getItem('token')}})
            console.log(result) 
            let users = result.data.expenses;
            ul.innerHTML = `` 
            users.forEach((value) => {
                displayExpense(value)
            })
            let prev = document.getElementById('prev')
            let curr = document.getElementById('curr')
            let next = document.getElementById('next')
            
            if(e.target.id == 'next'){
                prev.classList.remove('hide')
                // prev.textContent = curr.textContent
                prev.value = curr.value
                // curr.textContent = next.textContent
                curr.value = next.value
                if(result.data.totalExpenses > items * page){
                    next.value = +page + 1 // string to number
                    // next.textContent = +page + 1
                    next.classList.remove('hide')
                }else{
                    next.classList.add('hide')
                }
            }else if(e.target.id == 'prev'){
                if(page > 1){
                    next.classList.remove('hide')
                    // prev.textContent = page -1
                    prev.value = page-1

                    // curr.textContent = page
                    curr.value = page

                    // next.textContent = +page+1
                    next.value = +page+1
                }else{
                    prev.classList.add('hide')
                    // curr.textContent = 1
                    curr.value = 1
                    if(result.data.totalExpenses > items * page){
                        next.value = 2
                        // next.textContent = 2
                        next.classList.remove('hide')
                    }else{
    
                        next.classList.add('hide')
                    }
                }
            }
        }
    }catch(e){
        console.log(e)
    }
})


const dwm= document.getElementById('report') 
dwm.addEventListener('click',showButtons);
function showButtons(e){
    e.preventDefault();
    window.location="report_expense.html" 
}






