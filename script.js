class TodoApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.taskInput = document.getElementById("taskInput");
    this.addTaskBtn = document.getElementById("addTaskBtn");
    this.tasksList = document.getElementById("tasksList");
    this.emptyState = document.getElementById("emptyState");
    this.totalTasksEl = document.getElementById("totalTasks");
    this.completedTasksEl = document.getElementById("completedTasks");
    this.pendingTasksEl = document.getElementById("pendingTasks");

    this.init();
  }

  init() {
    this.addTaskBtn.addEventListener("click", () => this.addTask());
    this.taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTask();
    });

    this.renderTasks();
    this.updateStats();
  }

  addTask() {
    const taskText = this.taskInput.value.trim();
    if (!taskText) return;

    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks.unshift(task);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();

    this.taskInput.value = "";
    this.taskInput.focus();
  }

  toggleTask(id) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  renderTasks() {
    if (this.tasks.length === 0) {
      this.emptyState.style.display = "block";
      this.tasksList.style.display = "none";
      return;
    }

    this.emptyState.style.display = "none";
    this.tasksList.style.display = "block";

    this.tasksList.innerHTML = this.tasks
      .map(
        (task) => `
                    <li class="task-item ${
                      task.completed ? "task-completed" : ""
                    }">
                        <input 
                            type="checkbox" 
                            class="task-checkbox" 
                            ${task.completed ? "checked" : ""}
                            onchange="todoApp.toggleTask(${task.id})"
                        >
                        <span class="task-text">${this.escapeHtml(
                          task.text
                        )}</span>
                        <button class="delete-btn" onclick="todoApp.deleteTask(${
                          task.id
                        })">
                            Delete
                        </button>
                    </li>
                `
      )
      .join("");
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    const pending = total - completed;

    this.totalTasksEl.textContent = total;
    this.completedTasksEl.textContent = completed;
    this.pendingTasksEl.textContent = pending;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the app
const todoApp = new TodoApp();
