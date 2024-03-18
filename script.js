document.addEventListener('DOMContentLoaded', function() {
var tasks = [];
var editIndex = -1;

// Function to save tasks data to local storage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks data from local storage
function loadTasksFromLocalStorage() {
  var storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    updateTodoList(); // Update the task list after loading tasks
  }
}

// Call loadTasksFromLocalStorage when the page loads
loadTasksFromLocalStorage();

// Add event listeners after DOM content is loaded
document.getElementById('open-popup-btn').addEventListener('click', openPopup);
document.querySelector('.close-btn').addEventListener('click', closePopup);
document.getElementById('add-task-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    addTask(); // Call addTask function to handle form submission
});

// Add event listeners for filter options
document.getElementById('deadline-filter').addEventListener('input', filterTasks);
document.getElementById('priority-filter').addEventListener('change', filterTasks);
document.getElementById('category-filter').addEventListener('change', filterTasks);

// Add event listener for search input
document.getElementById('name-filter').addEventListener('input', function() {
  var searchQuery = this.value.trim().toLowerCase();
  var filteredTasks = tasks.filter(function(task) {
      return task.title.toLowerCase().includes(searchQuery);
  });
  updateTodoList(filteredTasks);
});




// Function to add task
function addTask() {
  // Retrieve input values
  var title = document.getElementById("title").value.trim();
  var description = document.getElementById("description").value.trim();
  var deadline = document.getElementById("deadline").value.trim();
  var time = document.getElementById("time").value.trim();
  var priority = document.getElementById("priority").value.trim();
  var category = document.getElementById("category").value.trim();

  // Check if any input is empty
  if (
    title === "" ||
    description === "" ||
    deadline === "" ||
    priority === "" ||
    category === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }

  // Check if in edit mode
  if (editIndex !== -1) {
    // Update existing task
    tasks[editIndex] = {
      title: title,
      description: description,
      deadline: deadline,
      time: time,
      priority: priority,
      category: category,
      completed: tasks[editIndex].completed, // Keep the completed status unchanged
    };
    editIndex = -1; // Reset editIndex
  } else {
    // Add task to the tasks array
    tasks.push({
      title: title,
      description: description,
      deadline: deadline,
      time: time,
      priority: priority,
      category: category,
      completed: false,
    });
  }

  // Clear input fields
  document.getElementById('title').value = "";
  document.getElementById('description').value = "";
  document.getElementById('deadline').value = "";
  document.getElementById('time').value = "";
  document.getElementById('priority').value = "";
  document.getElementById('category').value = "";

  // Show the task buttons
  var taskButtons = document.querySelector('.task-buttons');
  if (taskButtons) {
      taskButtons.style.display = 'block';
  }

  // Update the task list
  updateTodoList();

  // Save tasks to localStorage
  saveTasksToLocalStorage();
}

// Function to toggle task completion status
function toggleCompleted(index) {
  tasks[index].completed = !tasks[index].completed;
  updateTodoList();

  // Save tasks to localStorage
  saveTasksToLocalStorage();
}

// Function to update the task list
function updateTodoList(filteredTasks = tasks) {
  var todoList = document.getElementById('tasks');
  todoList.innerHTML = ""; // Clear existing tasks

  // Add each task to the list
  filteredTasks.forEach(function(task, index) {
    var listItem = document.createElement('li');
    listItem.classList.add('task');

    // Container for task title and buttons
    var taskHeader = document.createElement('div');
    taskHeader.classList.add('task-header');

    // Task title
    var titleHeading = document.createElement('h3');
    titleHeading.classList.add('task-title');
    titleHeading.textContent = task.title;
    if (task.completed) {
      titleHeading.classList.add('completed'); // Add completed class if task is completed
    }
    taskHeader.appendChild(titleHeading);

    // Buttons container
    var taskButtons = document.createElement('div');
    taskButtons.classList.add('task-buttons');

    // Button to toggle details visibility
    var viewDetailsBtn = document.createElement('button');
    viewDetailsBtn.classList.add('view-details-btn');
    viewDetailsBtn.textContent = 'View Details';
    viewDetailsBtn.onclick = function() {
      toggleDetails(index);
    };
    taskButtons.appendChild(viewDetailsBtn);

    // Button to toggle completion status
    var completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.textContent = 'Complete';
    completeBtn.onclick = function() {
      toggleCompleted(index);
    };
    taskButtons.appendChild(completeBtn);

    // Edit button
    var editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.textContent = 'Edit';
    editBtn.onclick = function() {
      editTask(index);
    };
    taskButtons.appendChild(editBtn);

    // Delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() {
      deleteTask(index);
    };
    taskButtons.appendChild(deleteBtn);

    taskHeader.appendChild(taskButtons);
    listItem.appendChild(taskHeader);

    // Task details (hidden by default)
    var detailsDiv = document.createElement('div');
    detailsDiv.classList.add('task-details');
    detailsDiv.style.display = 'none';
    detailsDiv.innerHTML = `
      <p>Description: <span class="task-description">${task.description}</span></p>
      <p>Deadline: <span class="task-deadline">${task.deadline}</span></p>
      <p>Time: <span class="task-time">${task.time}</span></p>
      <p>Priority: <span class="task-priority">${task.priority}</span></p>
      <p>Category: <span class="task-category">${task.category}</span></p>
    `;
    listItem.appendChild(detailsDiv);

    todoList.appendChild(listItem);
  });

  // Update aggregate task counts
  updateAggregate(filteredTasks);
}


// Function to toggle details visibility
function toggleDetails(index) {
  var detailsDiv = document.querySelectorAll('.task-details')[index];
  if (detailsDiv.style.display === 'none') {
      detailsDiv.style.display = 'block';
  } else {
      detailsDiv.style.display = 'none';
  }
}

// Function to delete a task
function deleteTask(index) {
  var confirmDelete = confirm("Are you sure you want to delete this task?")
  if(confirmDelete){
    tasks.splice(index, 1); // Remove the task from the tasks array
    updateTodoList(); // Update the task list
  }
  // Save tasks to localStorage
  saveTasksToLocalStorage();
}

// Function to edit a task
function editTask(index) {
  var task = tasks[index]; // Get the task object at the specified index

  // Populate form fields with existing task details
  document.getElementById('title').value = task.title;
  document.getElementById('description').value = task.description;
  document.getElementById('deadline').value = task.deadline;
  document.getElementById('time').value = task.time;
  document.getElementById('priority').value = task.priority;
  document.getElementById('category').value = task.category;

  // Store the index of the task being edited
  editIndex = index;

  // Change submit button to "Edit"
  document.getElementById('submit-button').textContent = 'Edit';
  openPopup();

  // Save tasks to localStorage
  saveTasksToLocalStorage();
}

// Function to update aggregate task counts
function updateAggregate() {
  var totalTasks = document.getElementById('totalTasks');
  var completedTasks = document.getElementById('completedTasks');
  
  // Calculate total tasks
  totalTasks.textContent = tasks.length;

  // Calculate completed tasks
  var completedCount = tasks.filter(function(task) {
      return task.completed;
  }).length;
  completedTasks.textContent = completedCount;
}

// Function to open the popup form
function openPopup() {
  document.getElementById('popup-form').style.display = 'block';
}

// Function to close the popup form
function closePopup() {
  document.getElementById('popup-form').style.display = 'none';
}

// Function to filter tasks based on criteria
function filterTasks() {
    var deadlineFilter = document.getElementById('deadline-filter').value.trim().toLowerCase();
    var priorityFilter = document.getElementById('priority-filter').value.trim().toLowerCase();
    var categoryFilter = document.getElementById('category-filter').value.trim().toLowerCase();

    var filteredTasks = tasks.filter(function(task) {
        var deadlineMatch = task.deadline.toLowerCase().includes(deadlineFilter) || deadlineFilter === '';
        var priorityMatch = task.priority.toLowerCase() === priorityFilter || priorityFilter === 'all';
        var categoryMatch = task.category.toLowerCase() === categoryFilter || categoryFilter === 'all';

        return deadlineMatch && priorityMatch && categoryMatch;
    });

    updateTodoList(filteredTasks);
}

});

