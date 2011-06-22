Backbone.sync = function (action, model, success, error) {

  var Util = {
    guid : function () {
      var S4 = function () {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
       return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
  }

  var save = function (task) {
    task.set({'id': Util.guid()});
    if (!localStorage['todo']) localStorage['todo'] = JSON.stringify({'tasks' : []});
    var tasks = JSON.parse(localStorage['todo']).tasks;
    tasks.push(task);
    localStorage['todo'] = JSON.stringify({'tasks': tasks});
    success(task);
  }

  var update = function (task) {
    var tasks = JSON.parse(localStorage['todo']).tasks;
    tasks = _.reject(tasks, function(t){ return t.id === task.id });
    tasks.push(task);
    localStorage['todo'] = JSON.stringify({'tasks': tasks});
  }

  if (action === 'load-sample') {
    for (var i = 0; i < 3; i++) {
      var t = new Task();
      t.save({'title' : 'task'+i, 'description': 'do something about:'+i, 'priority':i});
      new MainTaskEntry({model: t}).render();
    }
  }

  if (action === 'discard-all') {
    localStorage.clear('todo');
  }

  if (action === 'read' && model.constructor === Tasks) {
    if (localStorage['todo']) {
      success(JSON.parse(localStorage['todo']));  
    } else {
      success([]);
    }
  }

  if (action === 'create' && model.constructor === Task) {
    save(model);
  }

  if (action === 'update' && model.constructor === Task) {
    update(model);
  }
}
