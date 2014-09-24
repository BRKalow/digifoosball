# Rakefile
require 'sinatra/activerecord'
require 'sinatra/activerecord/rake'

begin
  require 'rspec/core/rake_task'
  task :default => :spec
  RSpec::Core::RakeTask.new(:spec)
rescue LoadError
  task :default do
    puts "RSpec not found"
    STDOUT.sync = true
  end
end
