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

  def increment_score(team)
    return if self.game_finished?

    team == 'home' ? self.score_home += 1 : self.score_away += 1
    self.player_home.handle_score 'home', team
    self.player_away.handle_score 'away', team

    self.score_history == '' ? (self.score_history += team) : (self.score_history += ',' + team)
    self.save!

    self.handle_game_over if self.game_finished?
  end

  def length
    ((self.updated_at - self.created_at)/60*4.0).round / 4.0
  end

  def handle_game_over
    self.determine_rating_change
    self.finished = 1; self.save!
    self.winner.handle_game_over 'win', self.length
    self.loser.handle_game_over 'loss', self.length
  end

  def determine_rating_change
    winner_rating = self.winner.rating
    loser_rating = self.loser.rating

    rating_diff = winner_rating - loser_rating
    exp = -1.0 * rating_diff / 400.0
    odds = 1.0 / (1.0 + 10 ** exp)

    if winner_rating < 2100
      k = 40
    elsif winner_rating >= 2100 && winner_rating < 2400
      k = 28
    else
      k = 16
    end

    self.winner.rating = winner_rating + k * (1.0 - odds)
    self.loser.rating = loser_rating - (self.winner.rating - winner_rating)

    if self.winner == self.player_home
      self.home_rating_change = self.winner.rating - winner_rating
      self.away_rating_change = loser_rating - self.loser.rating
    else
      self.home_rating_change = loser_rating - self.loser.rating
      self.away_rating_change = self.winner.rating - winner_rating
    end
  end
end
