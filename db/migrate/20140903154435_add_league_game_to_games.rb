class AddLeagueGameToGames < ActiveRecord::Migration
  def change
    add_column :games, :league_game, :integer
  end
end
