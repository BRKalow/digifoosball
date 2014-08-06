require 'sinatra/base'
require 'sinatra/activerecord'
require 'json'
require 'yaml'
require 'rest-client'

# Require all models
Dir[File.dirname(__FILE__) + '/models/*.rb'].each {|file| require file }
# Require all helpers
Dir[File.dirname(__FILE__) + '/helpers/*.rb'].each {|file| require file }

module DigiFoosball
  class Base < Sinatra::Base
    set :views, File.dirname(__FILE__) + '/views'
    set :environment, :development
    set :raise_errors, true

    register Sinatra::DeviceCloud

    helpers Sinatra::ErrorHelpers

    def push_stream(data)
      puts @@connections
      @@connections.each { |out| out << "data: #{data}\n\n" }
    end

    def increment_score(id, team)
      if Game.exists? params[:id]
        game = Game.find params[:id]
        game.increment_score params[:team]   

        push_stream game.to_json
      end
    end

    @@connections = []

    before do
      headers 'Content-Type' => 'application/json; charset=utf-8'
    end

    # Below be routes 

    get '/' do
      content_type 'text/html'
      erb :index
    end

    get '/connect' do
      content_type 'text/event-stream'
      stream :keep_open do |out|
        @@connections << out

        out.callback {
          @@connections.delete(out)
        }
      end
    end

    post '/push' do
      @connections.each { |out| out << params[:data]}
    end

    get '/api/user/:id' do
      if User.exists? params[:id]
        push_stream User.find(params[:id]).to_json
        return User.find(params[:id]).to_json
      else
        halt_with_404_not_found 'User not found' 
      end
    end

    get '/api/game/:id' do
      if Game.exists? params[:id]
        return Game.find(params[:id]).to_json
      else
        halt_with_404_not_found 'Game not found' 
      end
    end

    put '/receive_from_dc' do
      #resp = parse_dc_response
      #if resp[:should_update_score] increment_score resp[:id], resp[:team] end

      status 200
      body ''
    end

    # For testing:
    get '/artifical_dc_push/:id/:team' do
      increment_score params[:id], params[:team] 

      status 200
      body ''
    end
  end
end
