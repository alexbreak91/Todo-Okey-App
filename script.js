document.addEventListener("DOMContentLoaded", loadTasks);

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    let draggedElement = document.getElementById(data);
    event.target.closest("ul").appendChild(draggedElement);
    saveTasks();
}

function addTask() {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();
    if (taskText === "") return;

    let taskItem = document.createElement("li");
    taskItem.id = "task-" + Date.now();
    taskItem.draggable = true;
    taskItem.ondragstart = drag;
    taskItem.addEventListener("click", function(event) {
    if (!event.target.classList.contains("favorite-star")) {
        toggleTask(this);
    }
});
    taskItem.innerHTML = `${taskText} 
        <span class="icon golden-bell" onclick="setReminder('${taskText}')">🔔</span>
        <span class="icon favorite-star" onclick="toggleFavorite(this, '${taskText}')">⭐</span>`;

    document.getElementById("todoList").appendChild(taskItem);
    saveTasks();
    input.value = "";
}

function toggleTask(task) {
    if (task.parentElement.id === "todoList") {
        document.getElementById("doneList").appendChild(task);
    } else {
        document.getElementById("todoList").appendChild(task);
    }
    saveTasks();
}

function toggleFavorite(star, taskText) {
    let favoritesList = document.getElementById("favoritesList");
    if (star.classList.contains("active")) {
        star.classList.remove("active");
        [...favoritesList.children].forEach(item => {
            if (item.textContent.includes(taskText)) {
                item.remove();
            }
        });
    } else {
        star.classList.add("active");
        let favItem = document.createElement("li");
        favItem.textContent = taskText;
        favoritesList.appendChild(favItem);
    }
    saveTasks();
}

function setReminder(task) {
    let time = prompt("Inserisci l'ora del promemoria (HH:MM)");
    let date = prompt("Inserisci il giorno (YYYY-MM-DD)");
    if (!time || !date) return;
    let reminderTime = new Date(`${date}T${time}`);
    let now = new Date();
    if (reminderTime > now) {
        let delay = reminderTime - now;
        setTimeout(() => alert(`Promemoria: ${task}`), delay);
    }
}

function setRingtone(event) {
    let file = event.target.files[0];
    if (file) {
        let audio = new Audio(URL.createObjectURL(file));
        audio.play();
    }
}

function changeBackground(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url('${e.target.result}')`;
        };
        reader.readAsDataURL(file);
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify({
        todo: document.getElementById("todoList").innerHTML,
        done: document.getElementById("doneList").innerHTML,
        favorites: document.getElementById("favoritesList").innerHTML
    }));
}

function loadTasks() {
    let saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) {
        document.getElementById("todoList").innerHTML = saved.todo;
        document.getElementById("doneList").innerHTML = saved.done;
        document.getElementById("favoritesList").innerHTML = saved.favorites;
    }
}
