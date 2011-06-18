var Todo = (function(){
  var that = {};

  that.validate = function (title, description, priority) {
    return (!!title && title.length >= 5 && 
            !!description && description.length >= 5 &&
            !!priority && !~[0,1,2].indexOf(priority));
  };

  that.create = function (title, description, priority) {
    var task = {'title' : title, 'description' : description, 'priority' : priority};
    Repository.createTask(task, function(){
      alert('task created!');
    });
  };

  return that;
})();

$(document).ready(function(){

  // New task creation.
  $('#create-new-task-button').click(function() {
    var title = $('#title').val(),
        desc = $('#desc').val(),
        priority = $('#priority').val();

    if(Todo.validate(title, desc, priority)) {
      Todo.create(title, desc, priority);
    } else {
      alert('errors during task creation');
    }
  });

});