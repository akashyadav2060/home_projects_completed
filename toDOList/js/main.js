let newTask = document.getElementById('add-task');
let addTask = document.querySelector('button');
let newList = document.querySelector('.list');
let clearList = document.querySelector('.clr-btn')

document.addEventListener('DOMContentLoaded', loadTasks);

newTask.addEventListener('keypress', (e) => {
if (e.key === 'Enter'){
    const task = newTask.value.trim();
    if (task ==='') {
        alert('Enter Task to add')
    }
    else{
        addTaskToList(task);
        saveTaskToStorage(task);
        newTask.value='';
    }
}

       


});
addTask.addEventListener('click', (e)=>{
    const task = newTask.value.trim();
    if (task ==='') {
        alert('Enter Task to add')
    }
    else{
        addTaskToList(task);
        saveTaskToStorage(task);
        newTask.value='';
    }


});
clearList.addEventListener('click', (e)=>{
    e.preventDefault();
    clearAllTasks();

});
function loadTasks(){
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task =>addTaskToList(task));
}

function addTaskToList(task){
    const listItem = document.createElement('li');
    listItem.textContent = task;
    
    const deleteButton = document.createElement('button')
    deleteButton.textContent = '❌';
    deleteButton.classList.add('delete-button')
    deleteButton.addEventListener('click', ()=>{ 
        listItem.remove();
        removeTaskFromStorage(task);
    });
    listItem.appendChild(deleteButton);
    newList.appendChild(listItem)
}
function saveTaskToStorage(task){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function removeTaskFromStorage(taskToRemove){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task !== taskToRemove);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function clearAllTasks(){
    const listItems = newList.querySelectorAll('li');
    listItems.forEach(item=> item.remove());
    localStorage.removeItem('tasks');
}







