require 'sinatra'
require 'data_mapper'
require 'json'

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
  Document.all.to_json
end

post '/documents' do
  data = JSON.parse request.body.read
  Document.create :url => data['url'], :status => 0
end

delete '/documents/:id' do
  Document.get(params[:id]).destroy
  redirect to('/')
end
