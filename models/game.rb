class Game < ActiveRecord::Base
    attr_accessor :player_home, :player_away, :score_home, :score_away

    belongs_to :player_home, :class_name => 'User', :primary_key => 'player_home'
    belongs_to :player_away, :class_name => 'User', :primary_key => 'player_away'
end
