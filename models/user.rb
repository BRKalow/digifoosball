class User < ActiveRecord::Base
  has_many :home_games, :class_name => 'Game', :foreign_key => 'player_home_id'
  has_many :away_games, :class_name => 'Game', :foreign_key => 'player_away_id'

  after_initialize :set_defaults
  after_create :create_gravatar_hash

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
    self.time_played ||= 0
    self.gravatar ||= 0
    self.rating ||= 1400
  end

  def create_gravatar_hash
    self.gravatar = Digest::MD5.hexdigest self.email.downcase
    self.save!
  end

  def win_loss_percentage
    return self.wins.fdiv self.games_played
  end

  def total_games
    self.wins + self.losses
  end

  def handle_score(team, scorer)
    team == scorer ? self.goals_scored += 1 : self.goals_given += 1
    self.save!
  end

  def handle_game_over(result, game_length)
    if result == 'win'
      self.wins += 1
    elsif result == 'loss'
      self.losses += 1
    end
    self.games_played += 1
    self.time_played += game_length

    self.save!
  end
end
