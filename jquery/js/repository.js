var Repository = (function(){
  var that = {};
  var LS = localStorage;

  that.createTask = function (task, callback) {
    if(!LS['todo']) {
      LS['todo'] = JSON.stringify({'tasks' : []});
    }

    var todo = JSON.parse(LS['todo']);
    todo['tasks'].push(task);
    LS['todo'] = JSON.stringify(todo);
    callback();
  };

  return that;
})();