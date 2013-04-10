class CreateHappyHours < ActiveRecord::Migration
  def change
    create_table :happy_hours do |t|
      t.references :location
      t.string :name, :default => "Happy Hour"
      t.time :start_time
      t.time :end_time
      t.string :days
      t.integer :version
      t.integer :record_number

      t.timestamps
    end
    add_index :happy_hours, :location_id
    
    add_index :happy_hours, :end_time
    add_index :happy_hours, :start_time
  end
end
