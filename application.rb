require 'sinatra'
require 'data_mapper'

DataMapper.setup(:default, "sqlite3://#{Dir.pwd}/octopus.db")

class Document
  include DataMapper::Resource
  property :id, Serial
  property :url, String
  property :status, Integer
  property :created_at, DateTime
end

DataMapper.finalize
Document.auto_upgrade!

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/documents' do
  @documents = Document.all
end

post '/documents' do
  Document.create :url => params['url'], :status => 0
  redirect to('/')
end

delete '/documents/:id' do
  Document.get(params[:id]).destroy
  redirect to('/')
end
