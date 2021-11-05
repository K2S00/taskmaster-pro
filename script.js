//tasks is an object.
var tasks = {};

// In the createTask() function, these three data points create a <li> element 
//(with child <span> and <p> elements) that's appended to a <ul> element:

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
   //The addClass() method updates an element's class attribute with new values 
  .addClass("badge badge-primary badge-pill")
  
  // the text() method changes the element's text content (similar to element.textContent = ""; in plain JavaScript).
  .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
  
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

//The saveTasks() function simply saves the tasks object in localStorage,
var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};




// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    //The saveTasks() function simply saves the tasks object in localStorage,
    saveTasks();
  }
});

//The text() method often works with the trim() method to remove any extra white space before or after. 
//Many jQuery methods can be chained together, such as text().trim().


$(".list-group").on("click", "p", function() {
  var text = $(this)
    .text()
    .trim();

    //mental note... While $("textarea") tells jQuery to find all existing <textarea> elements
    // $("<textarea>") tells jQuery to create a new <textarea> element.
    var textInput = $("<textarea>")
  .addClass("form-control")
  .val(text);

  // append  <textarea> element
  $(this).replaceWith(textInput);

  $(".list-group").on("blur", "textarea", function() {
    // get the textarea's current value/text
    // //tasks[status][index] returns the object at the given index in the array.
var text = $(this)
.val()
.trim();

// get the parent ul's id attribute
var status = $(this)
  .closest(".list-group")
  .attr("id")
  .replace("list-", "");

// get the task's position in the list of other li elements
var index = $(this)
  .closest(".list-group-item")
  .index();
//Because we don't know the values, we'll have to use the variable names as placeholders.
//tasks[status] returns an array (e.g., toDo).
 
//tasks[status][index].text returns the text property of the object at the given index.
tasks[status][index].text = text;
  saveTasks();

  });
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();

    // recreate p element
var taskP = $("<p>")
.addClass("m-1")
.text(text);

// replace textarea with p element
$(this).replaceWith(taskP);
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();

//Ablity to edit task dates


// due date was clicked
$(".list-group").on("click", "span", function() {
  // get current text
  var date = $(this)
    .text()
    .trim();

  // create new input element
  // using jQuery's attr() method to set it as type="text"
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);

  // swap out elements
  $(this).replaceWith(dateInput);

  // automatically focus on new element
  dateInput.trigger("focus");
});

//convert them back when the user clicks outside (i.e., when the element's blur event occurs).

// value of due date was changed
$(".list-group").on("blur", "input[type='text']", function() {
  // get current text
  var date = $(this)
    .val()
    .trim();

  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to localstorage
  tasks[status][index].date = date;
  saveTasks();

  // recreate span element with bootstrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);

  // replace input with span element
  $(this).replaceWith(taskSpan);
});


