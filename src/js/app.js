
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const clearTasksButton = document.getElementById("clearTasksButton");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-buttons button");

let tasks = []; 


async function loadTasks() {
    try {
        const response = await fetch("./src/tasks.json");
        const data = await response.json();
        tasks = data;
        renderTasks();
    } catch (error) {
        console.error("Error al cargar las tareas:", error);
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        if (
            filter === "completed" && !task.completed ||
            filter === "notCompleted" && task.completed ||
            filter === "highPriority" && !task.highPriority
        ) return;

        const taskItem = document.createElement("li");
        taskItem.className = `task ${task.completed ? "completed" : ""} ${task.highPriority ? "high-priority" : ""}`;
        taskItem.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button class="edit" onclick="editTask(${index})">Editar</button>
                <button class="delete" onclick="deleteTask(${index})">Eliminar</button>
                <button class="finish" onclick="toggleTask(${index})">${task.completed ? "Pendiente" : "Completar"}</button>
                <button class="priority" onclick="togglePriority(${index})">${task.highPriority ? "Quitar Prioridad" : "Prioridad Alta"}</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

addTaskButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (!taskText) {
        alert("Por favor, escribe una tarea.");
        return;
    }

    const newTask = { text: taskText, completed: false, highPriority: false };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
});

window.editTask = function (index) {
    const newTaskText = prompt("Editar tarea:", tasks[index].text);
    if (newTaskText) {
        tasks[index].text = newTaskText;
        saveTasks();
        renderTasks();
    }
};


window.deleteTask = function (index) {
    if (confirm("¿Deseas eliminar esta tarea?")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
};


window.toggleTask = function (index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
};


clearTasksButton.addEventListener("click", () => {
    if (confirm("¿Seguro que deseas eliminar todas las tareas?")) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
});


searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    document.querySelectorAll(".task").forEach(task => {
        const text = task.querySelector("span").textContent.toLowerCase();
        task.style.display = text.includes(searchText) ? "" : "none";
    });
});


filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filterType = button.id.replace("filter", "").toLowerCase();
        renderTasks(filterType === "all" ? "all" : filterType);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
        tasks = savedTasks;
        renderTasks();
    } else {
        loadTasks();
    }
});

window.togglePriority = function (index) {
  tasks[index].highPriority = !tasks[index].highPriority;
  saveTasks();
  renderTasks();
};

document.getElementById("filterHighPriority").addEventListener("click", () => {
  renderTasks("highPriority");
});