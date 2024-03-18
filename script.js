var tasks = [];

//function to add task
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

  // Clear input fields
  document.getElementById('title').value = "";
  document.getElementById('description').value = "";
  document.getElementById('deadline').value = "";
  document.getElementById('time').value = "";
  document.getElementById('priority').value = "";
  document.getElementById('category').value = "";

  // Update the task list
  updateTodoList();
  
}


// Function to update the task list
function updateTodoList() {
  var todoList = document.getElementById('tasks');
  todoList.innerHTML = ""; // Clear existing tasks

  // Add each task to the list
  tasks.forEach(function(task, index) {
    var listItem = document.createElement('li');
    listItem.classList.add('task');

    // Container for task title and buttons
    var taskHeader = document.createElement('div');
    taskHeader.classList.add('task-header');

    // Task title
    var titleHeading = document.createElement('h3');
    titleHeading.classList.add('task-title');
    titleHeading.textContent = task.title;
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
  updateAggregate();
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

    // Remove the task from the tasks array
    tasks.splice(index, 1);

    // Update the task list
    updateTodoList();
}

// Function to toggle task completion status
function toggleCompleted(task) {
  task.completed = !task.completed;
  updateTodoList();
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