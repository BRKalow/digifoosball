require File.expand_path '../spec_helper.rb', __FILE__

describe "DigiFoosball App" do
  describe "get '/'" do
    it "returns successful" do
      get '/'
      expect(last_response).to be_ok
    end
  end

  describe "get '/api/user'" do
    it "returns all current users" do
      get '/api/user'
      expect(last_response.body).to eq User.all.to_json
    end
  end

  describe "get '/api/games'" do
    context "when params = []" do
      it "returns all current games" do
        get '/api/games'
        expect(last_response.body).to eq Game.all.to_json :include => [
          :player_home,
          :player_away
        ]
      end
    end

    context "when params[:finished] = 0" do
      it "returns all unfinished games" do
        get '/api/games', :finished => 0
        expect(last_response.body).to eq Game.where(finished:0).to_json(
          :include => [:player_home, :player_away]
        )
      end
    end

    context "when params[:finished] = 1" do
      it "returns all finished games" do
        get '/api/games', :finsihed => 1
        expect(last_response.body).to eq Game.where(finished:1).to_json(
          :include => [:player_home, :player_away]
        )
      end
    end

    context "when params[:limit] is defined" do
      it "returns X latest games" do
        get '/api/games', :limit => 5
        expect(JSON.parse(last_response.body).length).to eq 5
      end
    end
  end

  describe "error Sinatra::NotFound" do
    it "redirects to '/'" do
      get '/fakeroute'
      expect(last_response.status).to eq 302 
    end
  end
end
