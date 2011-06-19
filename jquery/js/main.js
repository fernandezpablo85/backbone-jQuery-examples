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
      $(document).trigger('todo:changed');
    });
  };
  
  that.clear = function () {
    Repository.clear();
    $(document).trigger('todo:changed');
  };
  
  that.loadSampleData = function () {
    Repository.loadSampleData();
    $(document).trigger('todo:changed');
  };
  
  that.updateList = function () {
    Repository.findNotDone(function (tasks) {
      var $list = $('#all-tasks ul');
      $list.empty();
      for(i in tasks) {
        var t = tasks[i];
        var markup = "<details class='p_"+t.priority+"'><summary>"+t.title+"<input type='checkbox' data-task-id='"+t.id+"'/></summary><span class='description'>"+t.description+"</span></details>";
        $list.append($('<li/>').html(markup));
      }
    });
  };
  
  that.updateNewest = function () {
    Repository.findNewest(function (tasks){
      var $list = $('#last-created ul');
      $list.empty();
      for(i in tasks) {
        var t = tasks[i];
        $list.append($('<li/>').html(t.title));
      }
    });
  };
  
  that.updateLastCompleted = function () {
    Repository.findLastCompleted(function (tasks){
      var $list = $('#last-completed ul');
      $list.empty();
      for(i in tasks) {
        var t = tasks[i];
        $list.append($('<li/>').html(t.title));
      }
    });
    
    that.complete = function (id) {
      Repository.markCompleted(id);
      $(document).trigger('todo:changed');
    }
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
  
  // Listen to changes in the model.
  $(document).bind('todo:changed', function() {
    Todo.updateList();
    Todo.updateNewest();
    Todo.updateLastCompleted();
  });
  
  // Manage task completion.
  $('#all-tasks').delegate('input', 'change', function(event) {
      var id = event.target.dataset.taskId;
      if (confirm('Mark as completed?')) Todo.complete(id);
  });

  $(document).trigger('todo:changed');
});