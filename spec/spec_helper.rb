require 'simplecov'
SimpleCov.start

require 'rack/test'

require File.expand_path '../../app.rb', __FILE__

ENV['RACK_ENV'] == 'test'

module RSpecMixin
  include Rack::Test::Methods
  def app() DigiFoosball::Base end
end

RSpec.configure { |c| c.include RSpecMixin }
