require 'simplecov'
SimpleCov.start

require 'rack/test'
require 'factory_girl'

require File.expand_path '../../app.rb', __FILE__
Dir[File.dirname(__FILE__) + '/factories/*.rb'].each {|file| require file }

ENV['RACK_ENV'] = 'test'

connection_info = YAML.load_file("config/database.yml")["test"]
ActiveRecord::Base.establish_connection(connection_info)

module RSpecMixin
  include Rack::Test::Methods
  def app() DigiFoosball::Base end
end

RSpec.configure do |c|
  c.include RSpecMixin
  c.include FactoryGirl::Syntax::Methods
end
