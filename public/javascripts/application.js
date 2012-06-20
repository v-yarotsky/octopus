$(function() {
  File = Backbone.Model.extend({})
  
  Files = Backbone.Collection.extend({
    model: File,
    url: '/documents'
  })
  
  var TaskView = Backbone.View.extend({
    tagName: 'div',
    className: 'document',
    template: _.template($('#document-template').html()),
    render: function() {
      this.$el.html(this.template(this.model))
      return this;
    }
  })
  
  var files = new Files()
  var TasksView = Backbone.View.extend({
    el: $('#content'),
    events: {
      'submit #form-document': 'addTask',
    },
    
    initialize: function() {
      files.bind('add', this.reset, this)
      files.bind('reset', this.reset, this)
      files.fetch()
    },
    
    addTask: function() {
      var url = $('input.url-field').val()
      this.clearForm()
      file = files.create({ 'url': url.toString() })
      return false;
    },
    
    reset: function() {
      this.$el.find('#documents').html('')
      var element = this.$el
      files.each(function(file) {
        fileView = new TaskView({ 'model' : file.toJSON() })
        element.find('#documents').append(fileView.render().$el)
      })  
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
