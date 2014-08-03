require 'rubygems'

Bundler.require

require 'sinatra/activerecord'

# Require all models
Dir[File.dirname(__FILE__) + '/models/*.rb'].each {|file| require file }

require './app'

set :environment, :development
set :run, false
set :raise_errors, true

run Sinatra::Application
