const tasklist = document.getElementById('todo-container')

const fetchData = (method, data) => {
    const fetchedData = fetch('http://localhost:3000/', {
        method: method,
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => res.json())
    return fetchedData;
}
const deleteData = (method, id) => {
    fetch(`http://localhost:3000/${id}`, {
        method: method,
    })
}

const updateData = async(method, id) => {
    const check = await ifDoneCheck(id)
    await (check.done) ? check.done = false : check.done = true
    fetch(`http://localhost:3000/${id}`, {
        method: method,
        body: JSON.stringify({ done: check.done }),
        headers: {
            "Content-Type": "application/json",
        },
    })
}

const ifDoneCheck = async(id) => {
    return fetch(`http://localhost:3000/${id}`, {
        method: 'GET',
        headers: {
        "Content-Type": "application/json",
    },}).then(res => res.json())
}

const awaitDataAndPlace = async() => {
    try {
        let check;
        const todos = await fetchData('GET')
        console.log(todos)
        tasklist.innerHTML = ""
        todos.forEach(todo => {
            (todo.done) ? check = 'done' : check;
            const divElement = document.createElement('div')
            divElement.classList.add('task')
            divElement.setAttribute('data-identifier', todo._id)
            const nameSpan = document.createElement('span')
            nameSpan.classList.add('taskname', check)
            nameSpan.innerHTML = todo.task
            nameSpan.addEventListener('click', () => completeTask(todo._id) )
            const removeDiv = document.createElement('div')
            removeDiv.id = 'remove'
            const trashButton = document.createElement('div')
            trashButton.classList.add('trash')
            trashButton.innerHTML = `<i class="fa-solid fa-trash-can"></i> <span>Remove?</span>`
            trashButton.addEventListener("click", () => removeThisTask(todo._id) )
            divElement.append(nameSpan, removeDiv)
            removeDiv.append(trashButton)
            tasklist.append(divElement)
        });
    } catch(err) {
        console.log(err);
    }
}

const postTask = async() => {
    let newTask = document.getElementById('newtask')
    if(newTask){
        try {
            await fetchData('POST', { task: newTask.value } )
            await awaitDataAndPlace()
            newTask.value = ''
        } catch(err) {
            console.log(err);
        }
    }
}

const removeThisTask = async(id) => {
    try {
        await deleteData('DELETE', id)
        await awaitDataAndPlace()
    } catch(err) {
        console.log(err);
    }
}

const completeTask = async(id) => {
    try {
        await updateData('PUT', id)
        await awaitDataAndPlace()
    } catch(err) {
        console.log(err);
    }
}

const button = document.getElementById('addtask')
button.addEventListener("click", postTask)

awaitDataAndPlace()

window.addEventListener('keypress', () => { if( event.key === 'Enter') { postTask() }})