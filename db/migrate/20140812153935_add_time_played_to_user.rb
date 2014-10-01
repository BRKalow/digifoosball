class AddTimePlayedToUser < ActiveRecord::Migration
  def change
    add_column :users, :time_played, :integer
  end
end
