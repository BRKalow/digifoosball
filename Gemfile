ruby '2.1.2'
source 'https://rubygems.org'

gem 'sinatra'
gem 'sinatra-activerecord'
gem 'thin'
gem 'rake'

# Device Cloud
gem 'nokogiri'
gem 'rest-client'

group :production do
  gem 'pg'
end

group :development do
  gem 'shotgun'
  gem 'tux'
end

group :test, :development  do
  gem 'rspec'
  gem 'sqlite3'
end

