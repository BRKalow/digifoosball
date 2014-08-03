set :views, File.dirname(__FILE__) + '/views'

before do
  headers 'Content-Type' => 'text/html; charset=utf-8'
end

get '/' do
   erb :index
end
