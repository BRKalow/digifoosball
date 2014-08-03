class Game < ActiveRecord::Base
    attr_accessor :player_home, :player_away, :score_home, :score_away,
                  :score_history

    belongs_to :player_home, :class_name => 'User'
    belongs_to :player_away, :class_name => 'User'

    after_initiliaze :set_defaults

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

    def increment_score(team)
      team == 'home' ? (self.score_home += 1) : (self.score_away += 1)
      self.score_history == '' ? (self.score_history += team) : (self.score_history += ',' + team)

      self.handle_game_over if self.game_finished?
    end
end
