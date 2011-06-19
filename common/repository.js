var Repository = (function(){
  var that = {},
      LS = localStorage,
      EMPTY_STORAGE = {'tasks':[]},
      SAMPLE_DATA = {'tasks':[{
        'title' : 'Walk the dog',
        'description' : 'Find a park. Walk the dog before noon.',
        'priority' : 2,
        'done' : false,
        'id' : Date.now(),
        'updated' : Date.now()
      },{
        'title' : 'Buy Milk',
        'description' : 'Go to the supermarket, buy a liter of fat-free milk.',
        'priority' : 1,
        'done' : false,
        'id' : Date.now() + 5,
        'updated' : Date.now() + 5
      },{
        'title' : 'Wash the car',
        'description' : 'Either do it yourself or send it somewhere.',
        'priority' : 0,
        'done' : false,
        'id' : Date.now() + 10,
        'updated' : Date.now() + 10
      }, {
        'title' : 'jQuery vs Backbone example',
        'description' : 'Create the jQuery vs Backbone example for next week\'s talk',
        'priority' : 0,
        'done' : true,
        'id' : Date.now() + 15,
        'updated' : Date.now() + 15,
      }
      ]};

  that.createTask = function (task, callback) {
    if(!LS['todo']) {
      LS['todo'] = JSON.stringify(EMPTY_STORAGE);
    }

    var todo = JSON.parse(LS['todo']);
    // all tasks are created as not completed by default.
    task.done = false;
    task.id = task.updated = Date.now()
    todo['tasks'].push(task);
    LS['todo'] = JSON.stringify(todo);
    callback();
  };
  
  var all = function () {
    return JSON.parse(LS['todo']).tasks;
  }
  
  var allByCreationDate = function () {
    return all().sort(function(t1, t2) {
      return +t1.id - +t2.id;
    });
  }

  var allByModifiedDate = function () {
    return all().sort(function(t1, t2) {
      return +t1.updated - +t2.updated;
    }); 
  }

  that.clear = function() {
    LS['todo'] = JSON.stringify(EMPTY_STORAGE);
  };

  that.loadSampleData = function () {
    LS['todo'] = JSON.stringify(SAMPLE_DATA);
  };

  that.findNotDone = function (callback) {
    var undone = all().filter(function(task) { return !task.done;})
    callback(undone);
  };

  that.findNewest = function (callback) {
    var last3 = allByCreationDate().slice(-3);
    callback(last3.reverse());
  };

  that.findLastCompleted = function (callback) {
    var last2completed = allByModifiedDate().filter(function(t){return t.done}).slice(-2);
    callback(last2completed.reverse());
  };
  
  that.markCompleted = function (id) {
    var result = [];
    all().forEach(function(task) {
      
      if (task.id == id) {
        task.done = true;
        task.updated = Date.now()
      }

      result.push(task);
      LS['todo'] = JSON.stringify({'tasks' : result});
    });
    
  };

  return that;
})();