class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :name
      t.string :address
      t.decimal :longitude
      t.decimal :latitude
      t.integer :version
      t.integer :record_number

      t.timestamps
    end
  end
end
