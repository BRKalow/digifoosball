class AddRatingChangedToGame < ActiveRecord::Migration
  def change
    add_column :games, :home_rating_change, :integer
    add_column :games, :away_rating_change, :integer
  end
end
