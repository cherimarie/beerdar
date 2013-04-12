class CreateBargains < ActiveRecord::Migration
  def change
    create_table :bargains do |t|
      t.references :happy_hour
      t.string :deal
      t.string :deal_type, :default => "Unknown"
      t.decimal :discount_or_price
      t.integer :version
      t.integer :record_number

      t.timestamps
    end
    add_index :bargains, :happy_hour_id
  end
end
