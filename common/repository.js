var Repository = (function(){
  var that = {},
      LS = localStorage,
      EMPTY_STORAGE = {'tasks':[]},
      SAMPLE_DATA = {'tasks':[{
        'title' : 'Walk the dog',
        'description' : 'Find a park. Walk the dog before noon.',
        'priority' : 2,
        'done' : false
      },{
        'title' : 'Buy Milk',
        'description' : 'Go to the supermarket, buy a liter of fat-free milk.',
        'priority' : 1,
        'done' : false
      },{
        'title' : 'Wash the car',
        'description' : 'Either do it yourself or send it somewhere.',
        'priority' : 0,
        'done' : false
      }, {
        'title' : 'jQuery vs Backbone example',
        'description' : 'Create the jQuery vs Backbone example for next week\'s talk',
        'priority' : 0,
        'done' : true
      }
      ]};

  that.createTask = function (task, callback) {
    if(!LS['todo']) {
      LS['todo'] = JSON.stringify(EMPTY_STORAGE);
    }

    var todo = JSON.parse(LS['todo']);
    // all tasks are created as not completed by default.
    task.done = false;
    todo['tasks'].push(task);
    LS['todo'] = JSON.stringify(todo);
    callback();
  };
  
  var findAll = function () {
    return JSON.parse(LS['todo']).tasks;
  }
  
  that.clear = function() {
    LS['todo'] = JSON.stringify(EMPTY_STORAGE);
  };

  that.loadSampleData = function () {
    LS['todo'] = JSON.stringify(SAMPLE_DATA);
  };

  that.findNotDone = function (callback) {
    var undone = findAll().filter(function(task) { return !task.done;})
    callback(undone);
  };

  that.findNewest = function (callback) {
    var last3 = findAll().slice(-3);
    callback(last3);
  };

  that.findLastCompleted = function (callback) {
    var last2completed = findAll().filter(function(t){return t.done}).slice(-2);
    callback(last2completed);
  };

  return that;
})();