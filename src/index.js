import "./styles.css";
//class for creating todo tasks
class Todo {
    constructor (title, description, dueDate, priority, notes) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.done = false;
        this.id = self.crypto.randomUUID();
    }
}
//class for creating proejcts that store todo tasks
class Project {
    constructor (name) {
        this.todos = [];
        this.name = name;
    }

    addTodo(todo) {
        this.todos.push(todo);
        let jsonstring = JSON.stringify(projects);
        localStorage.projects = jsonstring;
        localStorage.numberOfProjects = projects.length;
    }

    removeTodo(todo) {
        for (let i=0; i<this.todos.length; i++) {
            if (todo == this.todos[i]) {
                this.todos.splice(i, 1);
            }
        }
        let jsonstring = JSON.stringify(projects);
        localStorage.projects = jsonstring;
        localStorage.numberOfProjects = projects.length;
    }
}
//array that stores all projects currently created
let projects = [];
//delete all proejcts from dom, not from array
function clearProjects() {
    const loadedProjects = document.getElementsByClassName("project");
    for (let i=0; i<loadedProjects.length; i) {
        loadedProjects[i].remove();
    }
}
//create html for project in the sidebar
function createProjectDOM(projectName){
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project");
    document.getElementById("projects").appendChild(projectDiv);

    const projectLabel = document.createElement("label");
    projectLabel.classList.add("projectName");
    projectLabel.textContent = projectName;
    projectDiv.appendChild(projectLabel);

    projectDiv.addEventListener("click", function(){
        activateProject(projectDiv);
    })
}
//set project as active
function activateProject(project){
    if (document.getElementsByClassName("project")[0]) {
        let projectObject = 0;
        let projectDivs = document.getElementsByClassName("project");
        for (let i=0; i<projectDivs.length; i++) {
            projectDivs[i].classList.remove("activeProject");
        }
        project.classList.add("activeProject");
        for (let i=0; i<projects.length; i++) {
            if (projects[i].name == project.getElementsByTagName("label")[0].textContent) {
                projectObject = projects[i];
            }
        }
        clearTodoDisplay();
        loadTodos(projectObject);
    }
}
//delete all tasks from view, not from storage
function clearTodoDisplay(){
    let currentTodos = document.getElementsByClassName("todoContainer");
    for (let i=0; i<currentTodos.length; i) {
        currentTodos[0].remove();
    }
}
//load projects from array into DOM
function loadProjects() {
    for (let i=0; i<projects.length; i++) {
        let currentProject = projects[i];
        createProjectDOM(currentProject.name);
    }
}
//load todos from proejcts, into DOM
function loadTodos(activeProject) {
    if (activeProject.todos[0]) {

        let currentTodos = document.getElementsByClassName("todoContainer");

        for (let i=0; i<activeProject.todos.length; i++) {
            let alreadyExists = false;
            for (let j=0; j<currentTodos.length; j++) {
                if (activeProject.todos[i].id == currentTodos[j].dataset.indexNumber) {
                    alreadyExists = true;
                }
            }
            if (alreadyExists == false) {
                createTodoDOM(activeProject.todos[i].title, 
                activeProject.todos[i].description, 
                activeProject.todos[i].dueDate, 
                activeProject.todos[i].priority, 
                activeProject.todos[i].notes, 
                activeProject.todos[i].id)
            }
        }
    }
}
    

function createTodoDOM (title, description, dueDate, priority, notes, id) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todoSmall");
    todoDiv.classList.add("todoContainer");
    document.getElementById("content").appendChild(todoDiv);
    todoDiv.dataset.indexNumber = id;

    const upperRow = document.createElement("div");
    upperRow.classList.add("upperrow");
    todoDiv.appendChild(upperRow);

    const todoTitle = document.createElement("label");
    todoTitle.classList.add("todoTitle");
    todoTitle.textContent = title;
    upperRow.appendChild(todoTitle);

    const todoDate = document.createElement("label");
    todoDate.classList.add("todoDate");
    todoDate.textContent = dueDate;
    upperRow.appendChild(todoDate);

    const removeTodo = document.createElement("div");
    removeTodo.classList.add("removeTodo");
    removeTodo.textContent = "X";
    removeTodo.addEventListener("click", function(){
        if (document.getElementsByClassName("activeProject")[0]) {
        let activeProjectName = document.getElementsByClassName("activeProject")[0].getElementsByTagName("label")[0].textContent;
        let activeProject = 0;
        for (let i=0; i<projects.length; i++) {
            if (activeProjectName == projects[i].name){
                activeProject = projects[i];
            }
        }
        for (let i=0; i<activeProject.todos.length; i++) {
            if (activeProject.todos[i].id == id) {
                activeProject.removeTodo(activeProject.todos[i]);
            }
        }
        todoDiv.remove();
    }
    })
    upperRow.appendChild(removeTodo);

    const expandTodo = document.createElement("img");
    expandTodo.classList.add("expandTodo");
    expandTodo.src = "/menu-down.svg";
    upperRow.appendChild(expandTodo);

    const lowerRow = document.createElement("div");
    lowerRow.classList.add("hidden");
    lowerRow.id = "lowerrow";
    todoDiv.appendChild(lowerRow);

    const todoDescription = document.createElement("label");
    todoDescription.classList.add("todoDescription");
    todoDescription.textContent = description;
    lowerRow.appendChild(todoDescription);

    const todoNotes = document.createElement("label");
    todoNotes.classList.add("todoNotes");
    todoNotes.textContent = notes;
    lowerRow.appendChild(todoNotes);

    const todoPriority = document.createElement("label");
    if (priority == "urgent") {
        todoPriority.classList.add("todoPriorityUrgent");
        todoPriority.textContent = "Urgent";
    } else if (priority == "medium") {
        todoPriority.classList.add("todoPriorityMedium");
        todoPriority.textContent = "Medium";
    } else {
        todoPriority.classList.add("todoPriorityTakeYourTime");
        todoPriority.textContent = "Take your time";
    }
    lowerRow.appendChild(todoPriority);

    expandTodo.addEventListener("click", function(){
        if (lowerRow.classList.contains("hidden")) {
            lowerRow.classList.remove("hidden");
            lowerRow.classList.add("shown");

            todoDiv.classList.remove("todoSmall");
            todoDiv.classList.add("todoLarge");
        } else {
            lowerRow.classList.remove("shown");
            lowerRow.classList.add("hidden");

            todoDiv.classList.remove("todoLarge");
            todoDiv.classList.add("todoSmall");
        }
    })

}
//create project code
function addProject() {
    const projectNameInput = document.getElementById("projectNameInput");
    let projectName = projectNameInput.value;
    const newProject = new Project(projectName);
    projects.push(newProject); 
    projectNameInput.value = "";
    let jsonstring = JSON.stringify(projects);
    localStorage.projects = jsonstring;
    localStorage.numberOfProjects = projects.length;
}
//create todo code
function addTodo(title, description, dueDate, priority, notes) {
    const task = new Todo(title, description, dueDate, priority, notes);
    if (document.getElementsByClassName("activeProject")[0]) {
        let activeProjectName = document.getElementsByClassName("activeProject")[0].getElementsByTagName("label")[0].textContent;
        let activeProject = 0;
        for (let i=0; i<projects.length; i++) {
            if (activeProjectName == projects[i].name){
                activeProject = projects[i];
            }
        }
        activeProject.addTodo(task);
        loadTodos(activeProject);
    } else {
        alert("You need to have an object active to add todos.")
    }
}
//event listener for showing dialog allowing us to add project
const addItemBtn = document.getElementById("addItemIcon");
const dialog = document.getElementById("dialog");
addItemBtn.addEventListener("click", function(){
    dialog.show();
})
//button in the dialog previously shown
const createProjectBtn = document.getElementById("createProject");
createProjectBtn.addEventListener("click", function(){
    let activeProjectName = 0;
    if (document.getElementsByClassName("activeProject")[0]) {
        let activeProjectElement = document.getElementsByClassName("activeProject")[0];
        let activeProjectLabel = activeProjectElement.getElementsByTagName("label")[0];
        activeProjectName = activeProjectLabel.textContent;
    }
    clearProjects();
    addProject();
    loadProjects();

    if (activeProjectName) {
        let activeProject = 0;
        let projectDivs = document.getElementsByClassName("project");
        for (let i=0; i<projectDivs.length; i++) {
            if (activeProjectName == projectDivs[i].getElementsByTagName("label")[0].textContent) {
                activeProject = projectDivs[i];
            }
        }
        activateProject(activeProject);
    }
})
//event listener for showing dialog to add todo
const showAddTodoDialog = document.getElementById("addTodo");
const addTodoDialog = document.getElementById("addTodoDialog");
showAddTodoDialog.addEventListener("click", function(){
    addTodoDialog.show();
})
//button for adding todo, in the dialog
const submitAddTodoBtn = document.getElementById("submitAddTodo");
submitAddTodoBtn.addEventListener("click", function(){
    let taskNameElement = document.getElementById("taskName");
    let taskDescriptionElement = document.getElementById("taskDescription");
    let taskDueDateElement = document.getElementById("taskDueDate");
    let taskNotesElement = document.getElementById("taskNotes");
    let radioTakeTimeElement = document.getElementById("taskUrgencyTakeYourTime");

    let taskName = taskNameElement.value;
    let taskDescription = taskDescriptionElement.value;
    let taskDueDate = taskDueDateElement.value;
    let taskNotes = taskNotesElement.value;
    let urgency = "takeyourtime";
    let radioUrgent = document.getElementById("taskUrgencyUrgent");
    let radioMedium = document.getElementById("taskUrgencyMedium");
    if (radioUrgent.checked == true) {
        urgency = "urgent";
    } else if (radioMedium.checked == true) {
        urgency = "medium";
    }
    addTodo(taskName, taskDescription, taskDueDate, urgency, taskNotes);

    taskNameElement.value = ""; 
    taskDescriptionElement.value = ""; 
    taskDueDateElement.value = ""; 
    taskNotesElement.value = ""; 
    radioTakeTimeElement.checked = false;
    radioMedium.checked = false;
    radioUrgent.checked =  false;
})

function loadProjectsFromStorage() {
    if (localStorage.projects) {
        let savedProjects = JSON.parse(localStorage.projects);

        for (let i=0; i<localStorage.numberOfProjects; i++) {
            let project = new Project (savedProjects[i].name);
            project.todos = savedProjects[i].todos;
            projects.push(project);
        }
    }
}

loadProjectsFromStorage();
loadProjects();
if (projects[0]){} else {
    addProject();
    projects[0].name = "Default";
    loadProjects();
}
activateProject(document.getElementsByClassName("project")[0]);
if (document.getElementsByClassName("activeProject")[0]) {
    loadTodos(projects[0]);
}

