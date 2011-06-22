$(function() {

  var AuxConsole = Backbone.View.extend({

    events : {
      'click #clear' : 'clearLocalStorage',
      'click #sample' : 'loadSampleData'
    },
    
    clearLocalStorage : function () {
      Backbone.sync('discard-all');
    },
    
    loadSampleData : function () {
      Backbone.sync('load-sample');
    }
  });
  new AuxConsole({el : $('#commands')[0]});
  
  var AppView = Backbone.View.extend({
    
    events : {
      'click #create-new-task-button' : 'createTask',
    },

    createTask : function () {
      var task = new Task();
      task.bind('error', function (object, msg) {
        alert('problems during creation: '+msg);
      });
      var success = function (model) {
        model.completed();
      };
      task.save({'title' : $('#title').val(), 'description' : $('#desc').val(), 'priority' : $('#priority').val()}, {'success' : success});
      new MainTaskEntry({ model : task }).render();
    }
    
  });
  new AppView({el : document});
});