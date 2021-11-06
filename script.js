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
    console.log(list, arr);
  
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

// task text was clicked
$(".list-group").on("click", "p", function() {
  // get current text of p element
  var text = $(this)
    .text()
    .trim();

    //mental note... While $("textarea") tells jQuery to find all existing <textarea> elements
    // $("<textarea>") tells jQuery to create a new <textarea> element.
    // replace p element with a new textarea
    var textInput = $("<textarea>")
  .addClass("form-control")
  .val(text);

  // append  <textarea> element
  $(this).replaceWith(textInput);

  // auto focus new element
  textInput.trigger("focus");
});
  
// editable field was un-focused
$(".list-group").on("blur", "textarea", function() {
   
    // //tasks[status][index] returns the object at the given index in the array.

    // get current value of textarea
    var text = $(this).val();

     // get status type and position in the list
  var status = $(this)
  .closest(".list-group")
  .attr("id")
  .replace("list-", "");
var index = $(this)
  .closest(".list-group-item")
  .index();

  // update task in array and re-save to localstorage
  tasks[status][index].text = text;
  saveTasks();

// recreate p element
var taskP = $("<p>")
.addClass("m-1")
.text(text);

// replace textarea with new content
$(this).replaceWith(taskP);
});

// due date was clicked
$(".list-group").on("click", "span", function() {
  // get current text
  var date = $(this)
    .text()
    .trim();

  // create new input element
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);
  $(this).replaceWith(dateInput);

  // automatically bring up the calendar
  dateInput.trigger("focus");
});

// value of due date was changed
$(".list-group").on("blur", "input[type='text']", function() {
  var date = $(this).val();

  // get status type and position in the list
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to localstorage
  tasks[status][index].date = date;
  saveTasks();

  // recreate span and insert in place of input element
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);
    $(this).replaceWith(taskSpan);
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();




