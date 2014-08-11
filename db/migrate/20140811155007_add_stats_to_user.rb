class AddStatsToUser < ActiveRecord::Migration
  def change
    add_column :users, :games_played, :integer
    add_column :users, :goals_scored, :integer
    add_column :users, :goals_given,  :integer
  end
end
