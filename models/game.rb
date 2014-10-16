class Game < ActiveRecord::Base
  belongs_to :player_home, :class_name => 'User'
  belongs_to :player_away, :class_name => 'User'

  default_scope { order('created_at DESC') }

  after_initialize :set_defaults

  def set_defaults
    self.player_home_id ||= 0
    self.player_away_id ||= 0
    self.score_home ||= 0
    self.score_away ||= 0
    self.score_history ||= ''
    self.finished ||= 0
    self.home_rating_change ||= 0
    self.away_rating_change ||= 0
    self.league_game ||= 0
    self.manual ||= 0
  end

  def self.by_player(user_id)
    where("player_home_id = :u_id OR player_away_id = :u_id", u_id: user_id)
  end

  def game_finished?
    self.score_home >= 5 || self.score_away >= 5
  end

  def winner
    self.score_home >= 5 ? (self.player_home) : (self.player_away)
  end

  def loser
    self.score_home < 5 ? (self.player_home) : (self.player_away)
  end

  def score_per_team
    self.score_history.split(',').each_with_object(Hash.new(0)) do |word,counts|
      counts[word] += 1
    end
  end

  def increment_score(team)
    return if self.game_finished?

    team == 'home' ? self.score_home += 1 : self.score_away += 1

    if self.league_game.nonzero?
      self.player_home.handle_score 'home', team
      self.player_away.handle_score 'away', team
    end

    self.score_history == '' ? (self.score_history += team) : (self.score_history += ',' + team)
    self.save!

    self.handle_game_over if self.game_finished?
  end

  def length
    ((self.updated_at - self.created_at)/60*4.0).round / 4.0
  end

  def handle_game_over
    self.finished = 1
    if self.league_game.nonzero?
      self.determine_rating_change
      self.winner.handle_game_over 'win', self.length
      self.loser.handle_game_over 'loss', self.length
    end
    self.save!
  end

  def determine_rating_change
    scores = self.score_per_team
    goal_weight = (scores['home'] - scores['away']).abs / 10.0
    rating_diff = (self.loser.rating - self.winner.rating).abs

    rating = Integer 10*(1 + (goal_weight - (1 / (1.0 + 10**((rating_diff) / 400.0)))))    
    rating = 0 if rating < 0

    self.winner.rating += rating * 2
    self.loser.rating  = (self.loser.rating - rating < 0) ? 0 : self.loser.rating - rating

    if self.winner == self.player_home
      self.home_rating_change = rating * 2 
      self.away_rating_change = rating 
    else
      self.home_rating_change = rating 
      self.away_rating_change = rating * 2 
    end
  end
end
