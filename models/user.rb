class User < ActiveRecord::Base
  has_many :home_games, :class_name => 'Game', :foreign_key => 'player_home_id'
  has_many :away_games, :class_name => 'Game', :foreign_key => 'player_away_id'

  after_initialize :set_defaults

  def games
    home_games + away_games
  end

  def set_defaults
    self.name ||= 'John'
    self.email ||= 'john.doe@example.com'
    self.wins ||= 0
    self.losses ||= 0
    self.department ||= 'General'
    self.games_played ||= 0
    self.goals_scored ||= 0
    self.goals_given ||= 0
  end
  
  def win_loss_percentage
    return self.wins.fdiv self.games_played
  end
end
