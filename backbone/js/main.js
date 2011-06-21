$(document).ready(function() {
  
  // Todo list item (Task).
  var Task = Backbone.Model.extend({

    defaults : {
      done : false
    },

    complete : function () {
      this.set({'done' : true});
      this.view.remove();
    },

    validate : function (_att) {
      var att = {}
      _.extend(att, _att, this.attributes);
      if (!att.title || att.title.length < 5) return "wrong title";
      if (!att.description || att.description.length < 5) return "wrong description";
      if (att.priority == undefined || !~[0,1,2].indexOf(+att.priority)) return "wrong priority";
    }
  });

  var MainTaskEntry = Backbone.View.extend({
    tagName : 'li',

    template: _.template($('#entry-template').html()),
    
    events : {
      'change input' : 'complete'
    },

    initialize : function () {
      this.model.view = this;
    },

    render : function () {
      $(this.el).html(this.template(this.model.toJSON()));
      this.appendMe();
    },

    appendMe : function () {
      $('#all-tasks ul').append(this.el);
    },
    
    complete : function () {
      this.model.complete();
    }
  });
  
  var AuxConsole = Backbone.View.extend({

    events : {
      'click #clear' : 'clearLocalStorage',
      'click #sample' : 'loadSampleData'
    },
    
    clearLocalStorage : function () {
      Backbone.sync('discard-all')
    },
    
    loadSampleData : function () {
      Backbone.sync('load-sample')
    }
  });
  new AuxConsole({el : $('#commands')[0]});

  // Manage with a Bacbkone.View.
  $('#create-new-task-button').click(function() {
    var task = new Task();
    task.bind('error', function (object, msg) {
      alert('problems during creation: ' + msg);
    });
    task.save({'title' : $('#title').val(), 'description' : $('#desc').val(), 'priority' : $('#priority').val()});
    new MainTaskEntry({ model : task }).render();
  });

  var Util = {
    guid : function () {
      var S4 = function () {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
       return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
  }

  Backbone.sync = function (action, model, success, error) {

    var save = function (task) {
      task.set({'id': Util.guid});
      if (!localStorage['todo']) localStorage['todo'] = JSON.stringify({'tasks' : []});
      var tasks = JSON.parse(localStorage['todo']).tasks;
      tasks.push(task);
      localStorage['todo'] = JSON.stringify({'tasks': tasks});
    }

    var update = function (task) {
      var tasks = JSON.parse(localStorage['todo']).tasks;
      tasks = _.reject(tasks, function(t){ return t.id === task.id });
      tasks.push(task);
      localStorage['todo'] = JSON.stringify({'tasks': tasks});
    }

    // load sample data.
    if (action === 'load-sample') {
      for (var i = 0; i < 3; i++) {
        var t = new Task();
        t.save({'title' : 'task'+i, 'description': 'do something about:'+i, 'priority':i});
        new MainTaskEntry({model: t}).render();
      }
    }

    // clear all data.
    if  (action === 'discard-all') {
      console.log('kill em')
    }

    // retrieve all tasks.

    // create new task.
    if (action === 'create' && model.constructor === Task) {
      save(model);
    }

    if (action === 'update' && model.constructor === Task) {
      update(model);
    }
  }
});
