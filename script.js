
let notesForm = document.querySelector("#notes-list")
let notesList = document.querySelector(".notes")

notesForm.addEventListener("submit", function(event) {
    let notesTextInput = document.querySelector("#notes-text")
    let notesText = notesTextInput.value 
    event.preventDefault ()
    //create a new note item on the list by sending a POST
    //request so that it is added to the database
    notesTextInput.value = ""
    createNewNote (notesText)
})

function renderNotes () {
    notesList.innerHTML = ""
    fetch('http://localhost:3000/notes', {
        method: "GET"
    })
    .then(response => response.json())
    .then(function (data) {
        let list = document.createElement("ul")
        //this is the parent of the new list of notes:
        list.id = "item-list"
        for (let item of data) {
            let listItem = document.createElement("li")
            listItem.dataset.id = item.id
            listItem.innerText = item.item
            let deleteIcon = document.createElement("span")
            deleteIcon.id = "delete"
            deleteIcon.classList.add("fa", "fa-trash", "mar-l-xs")
            listItem.appendChild(deleteIcon)
            let editIcon = document.createElement("span")
            editIcon.id = "edit"
            editIcon.classList.add("fa", "fa-edit")
            let saveIcon = document.createElement("span")
            saveIcon.id = "save"
            saveIcon.classList.add("fa", "fa-save")
            listItem.appendChild(editIcon)
            listItem.appendChild(saveIcon)
            list.appendChild(listItem)
            notesList.appendChild(list)
        }
    }) .then(() => editNotesItem)
}

function editNotesItem (itemId) {
    let noteToEdit = document.querySelector(`li[data-id="${itemId}"]`)
    let notesTextInput = document.querySelector("#notes-text")
    let notesText = notesTextInput.value 
    fetch(`http://localhost:3000/notes/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item:notesText, done: false, created: moment().format() })
    })
    .then(response => response.json())
    .then(function () {
        let newChildEl = document.createElement("input")
        let list = document.querySelector("#item-list")
        newChildEl.id = "edited-child"
        newChildEl.innerText = ("")
        list.appendChild(newChildEl)
        // oldInputParent.appendChild(newChildEl)
        // newChildEl.appendChild(newChildEl)
        list.replaceChild(newChildEl, noteToEdit)
    })
}

//write the fetch request to post data in its own function
function createNewNote (notesText) {
    fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item:notesText, done: false, created: moment().format() })
    })
    .then(() => renderNotes())
}

function noteFeed () {
    let notesAppear = document.querySelector(".notes")
    let notesDiv = document.createElement("div")
    notesAppear.appendChild(notesDiv)
}

notesList.addEventListener("click", function(event) {
    let targetEl = event.target
    if (targetEl.matches("#edit")) {
        console.log("EDIT")
        editNotesItem(targetEl.parentElement.dataset.id)
    } else if (targetEl.matches("#save")) {
        console.log("SAVE")
    } else if (targetEl.matches("#delete")) {
        console.log("DELETE")
        deleteNotesItem(targetEl.parentElement.dataset.id)
    }
})

function deleteNotesItem (itemId) {
    let noteToDelete = document.querySelector(`li[data-id="${itemId}"]`)
    fetch(`http://localhost:3000/notes/${itemId}`, {
        method: "DELETE"
    })
    .then(function () {
        document.querySelector("#item-list").removeChild(noteToDelete)
    })
}

// function newChild (itemId) {
    // let oldInputParent = document.querySelector("#item-list")
    
    
    // let noteToEdit = document.getElementById(`li[data-id="${itemId}"]`)
    // let listItem = document.createElement("li")
    // listItem.dataset.id = item.id
    // listItem.innerText = item.item
//     fetch(`http://localhost:3000/notes/${itemId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ item:noteToEdit, done: false, created: moment().format() })
//     })
// }