$(function() {
  var content = $('#content')
  
  File = Backbone.Model.extend({
    initialize: function() {
      this.bind('error', this.alert)
    },
    
    validate: function() {
      if(!/http:/.test(this.get('url'))) { return '<strong>url</strong> is not valid' }
    },
    
    alert: function(model, error) {
      content.prepend('<div id="alert">' + error + '</div>')
    }
  })
  
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
    el: content,
    events: {
      'submit #form-file': 'addFile',
    },
    
    initialize: function() {
      this.container = this.$el.find('#files')
      this.form = this.$el.find('form#form-file')
      
      files.bind('add', this.display, this)
      files.bind('reset', this.rebuild, this)
      files.bind('remove', this.rebuild, this)
      files.fetch()
    },
    
    addFile: function() {
      var url = this.form.find('input.url-field').val()
      this.clearForm()
      this.clearAlert()
      files.create({ 'url': url.toString() })
      return false;
    },
    
    display: function(file) {
      view = new FileView({ 'model' : file.toJSON() })
      this.container.prepend(view.render().$el)
    },
    
    rebuild: function() {
      this.$el.find('#files').html('')
      element = this
      files.each(function(file) { element.display(file) })
    },
    
    clearForm: function() {
      $('input.url-field').val('')
    },
    
    clearAlert: function() {  
      $('#alert').remove()
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
