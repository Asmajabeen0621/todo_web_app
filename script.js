// Get references to the HTML elements
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');

// Initialize tasks from Local Storage or an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to save the tasks array to Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to render the entire list from the 'tasks' array
function renderTasks() {
    todoList.innerHTML = ''; // Clear the current list

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.classList.toggle('completed', task.completed);
        listItem.setAttribute('data-index', index);

        // Task display structure
        listItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="actions">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;

        // 1. Toggle Completion (Click on the text)
        listItem.querySelector('.task-text').addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks(); // Re-render to update the visual state
        });

        // 2. Delete Task
        listItem.querySelector('.delete-btn').addEventListener('click', () => {
            tasks.splice(index, 1); // Remove from the array
            saveTasks();
            renderTasks(); // Re-render the list
        });

        // 3. Inline Edit Task
        listItem.querySelector('.edit-btn').addEventListener('click', (e) => {
            handleEdit(listItem, index);
        });

        todoList.appendChild(listItem);
    });
}

// Function to handle the inline editing process
function handleEdit(listItem, index) {
    const taskTextSpan = listItem.querySelector('.task-text');
    const originalText = tasks[index].text;
    
    // Replace the span with an input field
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('task-edit-input');
    editInput.value = originalText;
    
    // Replace the text span with the input field
    listItem.replaceChild(editInput, taskTextSpan);
    editInput.focus();

    const saveEdit = () => {
        const newText = editInput.value.trim();
        if (newText && newText !== originalText) {
            tasks[index].text = newText;
            saveTasks();
        }
        renderTasks(); // Re-render the list to show the updated text or revert if empty
    };

    // Save on 'Enter' key press
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });

    // Save when the input loses focus (click outside)
    editInput.addEventListener('blur', saveEdit);
}


// Function to add a new task
function addTask() {
    const text = taskInput.value.trim();

    if (text) {
        // Add new task object to the array
        tasks.push({ text: text, completed: false });
        
        saveTasks();
        renderTasks();
        taskInput.value = ''; // Clear input
        taskInput.focus();
    } else {
        alert("Please enter a task!");
    }
}

// Event Listeners
addButton.addEventListener('click', addTask);

// Allows adding task by pressing 'Enter' key in the input field
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial call to load and display tasks when the page loads
renderTasks();