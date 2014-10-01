$stdout.sync = true

require 'rubygems'

Bundler.require

RACK_ENV='development'

require './app'

run DigiFoosball::Base
