class AddTimePlayedToUser < ActiveRecord::Migration
  def change
    remove_column :users, :time_played
    add_column :users, :time_played, :real
  end
end
