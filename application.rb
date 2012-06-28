require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'data_mapper'
require 'json'

DataMapper.setup(:default, "sqlite3://#{Dir.pwd}/octopus.db")

module Octopus
  class File
    include DataMapper::Resource
    property :id, Serial
    property :url, String
    property :status, Integer
    property :created_at, DateTime
  end
end

DataMapper.finalize
Octopus::File.auto_upgrade!

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/files' do
  Octopus::File.all.to_json
end

post '/files' do
  data = JSON.parse request.body.read
  file = Octopus::File.create :url => data['url'], :status => 0
  `wget #{file.url} -P downloads`
end

delete '/files/:id' do
  Octopus::File.get(params[:id]).destroy
  redirect to('/')
end
