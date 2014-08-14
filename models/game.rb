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
    self.winner.handle_game_over 'win', self.length
    self.loser.handle_game_over 'loss', self.length
  end
end
