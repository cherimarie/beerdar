class AddSameBargainsToHappyHour < ActiveRecord::Migration
  def change
    add_column :happy_hours, :same_bargains, :integer
  end
end
