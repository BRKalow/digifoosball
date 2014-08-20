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
      @@connections.each { |out| out << "data: #{data}\n\n" }
    end

    def increment_score(id, team)
      if Game.exists? id
        game = Game.find id
        game.increment_score team

        push_stream game.to_json :include => [:player_home, :player_away]
      end
    end

    @@connections = []
    @@previous_value = 0

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

    get '/api/user' do
      User.all.to_json
    end

    post '/api/user' do
      params.merge! JSON.parse(request.env["rack.input"].read)

      user = User.new params; user.save!

      status 201

      message = Hash.new; message = {:msg => 'A new challenger approaches!'}
      push_stream message.to_json

      return user.to_json
    end

    get '/api/user/:id' do
      if User.exists? params[:id]
        return User.find(params[:id]).to_json(:include => {
                                                :games => {
                                                  :include => [:player_home,
                                                               :player_away]
                                                }
                                              })
      else
        halt_with_404_not_found 'User not found'
      end
    end

    get '/api/games' do
      if !params.empty?
        return Game.where(finished:params[:finished].to_i)
                   .to_json(:include => [:player_home, :player_away])
      end
      Game.all.to_json :include => [:player_home, :player_away]
    end

    post '/api/games' do
      params.merge! JSON.parse(request.env["rack.input"].read)

      game = Game.new params; game.save!

      status 201

      message = Hash.new; message = {:msg => 'A game has started!'}
      push_stream message.to_json

      game = game.to_json :include => [:player_home, :player_away]
      push_stream game

      return game
    end

    get '/api/games/:id' do
      if Game.exists? params[:id]
        return Game.find(params[:id]).to_json :include => [:player_home, :player_away]
      else
        halt_with_404_not_found 'Game not found'
      end
    end

    get '/api/statistics' do
      result = {
        :games_played => Game.count,
        :goals_scored => User.sum(:goals_scored),
        :players =>      User.count,
        :time_spent =>   User.sum(:time_played)
      }.to_json
    end

    put '/receive_from_dc' do
      if Game.first.finished == 0
        params.merge! JSON.parse(request.env["rack.input"].read)
        resp = parse_dc_response params["Document"]["Msg"]["DataPoint"], @@previous_value
        @@previous_value = resp["value"]
        if resp[:should_increment_score]
          increment_score resp[:id], resp[:team] 
        end
      end
      status 200
      body ''
    end

    # For testing:
    get '/artificial_dc_push/:id/:team' do
      increment_score params[:id], params[:team]

      status 200
      body ''
    end

    error Sinatra::NotFound do
      redirect to '/'
    end
  end
end
