const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskDatetime = document.getElementById("task-datetime");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const datetime = taskDatetime.value;

  if (taskText === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    datetime,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `<li style="text-align:center; opacity: 0.6;">No tasks yet! 🎉</li>`;
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.classList.toggle("completed", task.completed);

    const taskInfo = document.createElement("div");
    taskInfo.classList.add("task-info");
    taskInfo.innerHTML = `<span>${task.text}</span>` +
      (task.datetime ? `<div class="date">🕒 ${new Date(task.datetime).toLocaleString()}</div>` : "");

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeBtn = document.createElement("button");
    completeBtn.innerHTML = task.completed ? "↩️ Undo" : "✅ Done";
    completeBtn.classList.add("action-btn");
    completeBtn.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️ Edit";
    editBtn.classList.add("action-btn");
    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit your task:", task.text);
      if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️ Delete";
    deleteBtn.classList.add("action-btn", "delete");
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    actions.append(completeBtn, editBtn, deleteBtn);
    li.append(taskInfo, actions);
    taskList.appendChild(li);
  });
}

renderTasks();
