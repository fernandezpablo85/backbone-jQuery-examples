$(function(){
  window.Task = Backbone.Model.extend({

    defaults : {
      done : false
    },

    complete : function () {
      this.save({'done' : true});
      this.view.remove();
    },
    
    completed : function () {
      new NewEntryView({model : this}).render();
    },

    validate : function (_att) {
      var att = {}
      _.extend(att, this.attributes, _att);
      if (!att.title || att.title.length < 5) return "wrong title";
      if (!att.description || att.description.length < 5) return "wrong description";
      if (att.priority == undefined || !~[0,1,2].indexOf(+att.priority)) return "wrong priority";
    }
  });

  window.MainTaskEntry = Backbone.View.extend({
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
      new LastCompletedEntry({model : this.model}).render();
    }
  });
  
  var MiniView = Backbone.View.extend({
    tagName : 'span',

    template : _.template($('#mini-template').html()),

    render : function () {
      $(this.el).html(this.template(this.model.toJSON()));
      $(this.list).prepend(this.el);
    }
  });
  
  window.LastCompletedEntry = MiniView.extend({'list' : '#last-completed ul'});
  window.NewEntryView = MiniView.extend({ 'list' : '#last-created ul'});
  
  window.Tasks = Backbone.Collection.extend({

    model : Task,

    parse : function (response){
      return response.tasks;
    },

    loadTodos : function () {
      this.select(function (t) { return !t.attributes.done})
          .forEach(function(t) { new MainTaskEntry({model : t }).render();});
    },

    loadCompleted : function () {
      this.select(function (t) { return t.attributes.done})
          .forEach(function (t) { new LastCompletedEntry({model : t}).render();});
    },
    
    loadLastCreated : function (){
      _(this.models.slice(0,3)).each(function (t) {new NewEntryView({model : t}).render();});
    }

  });

  var tasks = new Tasks();
  tasks.fetch();
  tasks.loadTodos();
  tasks.loadCompleted();
  tasks.loadLastCreated();
});