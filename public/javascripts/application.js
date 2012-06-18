$(function() {
  var TaskView = Backbone.View.extend({
    tagName: 'div',
    className: 'document',
    template: _.template($('#document-template').html()),
    render: function() {
      this.$el.html(this.template(this.model))
      return this;
    }
  })
  
  var TasksView = Backbone.View.extend({
    el: $('#content'),
    events: {
      'submit #form-document': 'addTask',
    },
    
    addTask: function() {
      var id = $('.document').length + 1
      var url = $('input.url-field').val()
      this.clearForm()
      var taskView = new TaskView({ 'model': {'id': id, 'url': url, 'status': '0%' } })
      this.$el.find('#documents').append(taskView.render().$el)
      return false;
    },
    
    clearForm: function() {
      $('input.url-field').val('')
    }
  })
  
  var Workspace = Backbone.Router.extend({
    routes: {
     '': 'documents',
    },
    
    documents: function() {
      view = new TasksView()
    }
  })
  
  new Workspace()
  Backbone.history.start()
})
