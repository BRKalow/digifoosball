require 'json'

set :views, File.dirname(__FILE__) + '/views'

connections = []

def push_stream(data)
  connections.each { |out| out << data }
end

before do
  headers 'Content-Type' => 'application/json; charset=utf-8'
end

get '/' do
  content_type 'text/html'
  erb :index
end

get '/connect', provides: 'text/event-stream' do
  stream :keep_open do |out|
    connections << out

    out.callback {
      connections.delete(out)
    }
  end
end

post '/push' do
  connections.each { |out| out << params[:data]}
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
    game = Game.find params[:id]
    game.increment_score params[:team]   

    response = {
      :game =>        game.id,
      :score_home =>  game.score_home,
      :score_away =>  game.score_away
    }.to_json              

    push_stream response
  else
    return {:error => "Game not found"}.to_json
  end
end
