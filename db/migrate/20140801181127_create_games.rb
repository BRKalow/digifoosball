class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
        t.integer   :player_home_id
        t.integer   :player_away_id
        t.integer   :score_home
        t.integer   :score_away
        t.string    :score_history
        t.timestamps
    end
  end
end
