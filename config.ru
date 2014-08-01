require 'rubygems'
require 'sinatra-activerecord'

Bundler.require

require './app'

set :environment, :development
set :run, false
set :raise_errors, true

run Sinatra::Application
