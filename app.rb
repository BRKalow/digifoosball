set :views, File.dirname(__FILE__) + '/views'

before do
  headers 'Content-Type' => 'text/html; charset=utf-8'
end

get '/' do
   erb :index
end


# get '/api/user/:id' do
#   # logic
# end

# get '/api/game/:id' do
#   # logic
# end

# post '/api/increment_score' do
#   # logic
# end


