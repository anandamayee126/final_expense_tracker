var pagination= document.createElement('div');

function showPagination({currentPage,hasNextPage,nextPage,prevPage,hasPreviousPage,lastPage}){
    pagination.innerHTML = "";
    if(hasPreviousPage){
        const btn2= document.createElement('button');
        btn2.innerHTML= prevPage;
        btn2.addEventListener('click',() =>{
            getExpenses()

    })}
}

function getExpenses(pageNo){
    
}