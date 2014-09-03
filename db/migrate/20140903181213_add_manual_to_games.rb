class AddManualToGames < ActiveRecord::Migration
  def change
    add_column :games, :manual, :integer
  end
end
