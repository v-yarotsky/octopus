$(function() {
  File = Backbone.Model.extend({})
  
  Files = Backbone.Collection.extend({
    model: File,
    url: '/files'
  })
  
  var FileView = Backbone.View.extend({
    tagName: 'div',
    className: 'file',
    template: _.template($('#file-template').html()),
    render: function() {
      this.$el.html(this.template(this.model))
      return this;
    }
  })
  
  var files = new Files()
  var AppView = Backbone.View.extend({
    el: $('#content'),
    events: {
      'submit #form-file': 'downloadFile',
    },
    
    initialize: function() {
      files.bind('add', this.reset, this)
      files.bind('reset', this.reset, this)
      files.fetch()
    },
    
    downloadFile: function() {
      var url = $('input.url-field').val()
      this.clearForm()
      file = files.create({ 'url': url.toString() })
      return false;
    },
    
    reset: function() {
      this.$el.find('#files').html('')
      var element = this.$el
      files.each(function(file) {
        fileView = new FileView({ 'model' : file.toJSON() })
        element.find('#files').prepend(fileView.render().$el)
      })  
    },
    
    clearForm: function() {
      $('input.url-field').val('')
    }
  })
  
  var Workspace = Backbone.Router.extend({
    routes: {
     '': 'files',
    },
    
    files: function() {
      view = new AppView()
    }
  })
  
  new Workspace()
  Backbone.history.start()
})
