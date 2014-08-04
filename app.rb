require 'json'

set :views, File.dirname(__FILE__) + '/views'

before do
  headers 'Content-Type' => 'text/html; charset=utf-8'
end

get '/' do
   erb :index
end

get '/api/user/:id' do
  if User.exists? params[:id]
    return User.find(params[:id]).to_json
  else
    return {:error => "User not found"}.to_json
  end
end

get '/api/game/:id' do
  if Game.exists? params[:id]
    return Game.find(params[:id]).to_json
  else
    return {:error => "Game not found"}.to_json
  end
end

post '/api/increment_score' do
  if Game.exists? params[:id]
    Game.find(params[:id]).increment_score params[:team]   

    # socket.push updated_score
  else
    return {:error => "Game not found"}.to_json
end


