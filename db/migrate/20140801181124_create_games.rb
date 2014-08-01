class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
        t.integer   :player_home
        t.integer   :player_away
        t.integer   :score_home
        t.integer   :score_away
        t.integer   :winner
        t.timestamps
    end
  end
end
