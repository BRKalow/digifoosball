class AddGameFinishedToGame < ActiveRecord::Migration
  def change
    add_column :games, :finished, :integer
  end
end
