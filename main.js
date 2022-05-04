const tasklist = document.getElementById('todo-container')

const fetchData = (method, data) => {
    // Dynamically fetch data to use in multiple async functions
    const fetchedData = fetch('http://localhost:3000/', {
        method: method,
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    }).then(res => res.json())
    return fetchedData;
}
const deleteData = (method, id) => {
    // Your standard delete fetch
    fetch(`http://localhost:3000/${id}`, {
        method: method
    })
}

const updateData = async(method, id) => {
    // check if item.done is true or false
    const check = await ifDoneCheck(id)
    await (check.done) ? check.done = false : check.done = true;
    await fetch(`http://localhost:3000/${id}`, {
        method: method,
        body: JSON.stringify({ done: check.done }),
        headers: { "Content-Type": "application/json" }
    })
}
const updateTask = async(method, id, value) => {
    await fetch(`http://localhost:3000/${id}`, {
        method: method,
        body: JSON.stringify({ task: value }),
        headers: { "Content-Type": "application/json" }
    })
}

const ifDoneCheck = async(id) => {
    // Get specific task to check "Done"
    return await fetch(`http://localhost:3000/${id}`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    ,}).then(res => res.json())
}

const postTask = async() => {
    let newTask = document.getElementById('newtask')
    if(newTask.value){
        try {
            // Post new task
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
const editThisTask = async(e) => {
    const value = e.target.previousSibling.value
    const id = e.target.previousSibling.dataset.id
    if(value) {
        try {
            await updateTask('PUT', id, value)
            await awaitDataAndPlace()
        } catch(err) {
            console.log(err);
        }
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

const awaitDataAndPlace = async() => {
    try {
        let check;
        const todos = await fetchData('GET')
        // Empty content after each generate
        tasklist.innerHTML = ""
        // Add per todo an taskrow
        todos.forEach(todo => {
            (todo.done) ? check = 'done' : check = 'nuv';
            // check if todo.done is available. If so assign 'done' to check
            // Create div and neccesities
            const divElement = document.createElement('div')
            divElement.classList.add('task')
            divElement.setAttribute('data-identifier', todo._id)
            // Create span and neccesities
            const nameSpan = document.createElement('div')
            nameSpan.classList.add('taskname', check)
            const edit = document.createElement('div')
            const span = document.createElement('span')
            span.innerHTML = todo.task
            edit.id = ('edit')
            edit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'
            const input = document.createElement('input')
            const butti = document.createElement('button')
            input.setAttribute('data-id', todo._id);
            input.value = todo.task
            butti.innerHTML = "Save"
            edit.append(input)
            edit.append(butti)
            nameSpan.append(edit)
            nameSpan.append(span)
            // Create remove parent div and neccesities
            const removeDiv = document.createElement('div')
            removeDiv.id = 'remove'
            // Create remove child div and neccesities
            const trashButton = document.createElement('div')
            trashButton.classList.add('trash')
            trashButton.innerHTML = `<i class="fa-solid fa-trash-can"></i> <span>Remove?</span>`
            trashButton.addEventListener("click", () => removeThisTask(todo._id) )
            span.addEventListener('click', () => completeTask(todo._id) )
            butti.addEventListener("click", editThisTask )
            // Nest everything
            divElement.append(nameSpan, removeDiv)
            removeDiv.append(trashButton)
            tasklist.append(divElement)
        });
    } catch(err) {
        console.log(err);
    }
}

const button = document.getElementById('addtask')
button.addEventListener("click", postTask)
window.addEventListener('keypress', () => {  if( event.key === 'Enter') { postTask() } })

awaitDataAndPlace()
