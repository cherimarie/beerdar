# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130408224235) do

  create_table "bargains", :force => true do |t|
    t.integer  "happy_hour_id"
    t.string   "deal"
    t.string   "deal_type",         :default => "Unknown"
    t.decimal  "discount_or_price"
    t.integer  "version"
    t.integer  "record_number"
    t.datetime "created_at",                               :null => false
    t.datetime "updated_at",                               :null => false
  end

  add_index "bargains", ["happy_hour_id"], :name => "index_bargains_on_happy_hour_id"

  create_table "happy_hours", :force => true do |t|
    t.integer  "location_id"
    t.string   "name",          :default => "Happy Hour"
    t.time     "start_time"
    t.time     "end_time"
    t.string   "days"
    t.integer  "version"
    t.integer  "record_number"
    t.datetime "created_at",                              :null => false
    t.datetime "updated_at",                              :null => false
  end

  add_index "happy_hours", ["end_time"], :name => "index_happy_hours_on_end_time"
  add_index "happy_hours", ["location_id"], :name => "index_happy_hours_on_location_id"
  add_index "happy_hours", ["start_time"], :name => "index_happy_hours_on_start_time"

  create_table "locations", :force => true do |t|
    t.string   "name"
    t.string   "address"
    t.decimal  "longitude"
    t.decimal  "latitude"
    t.integer  "version"
    t.integer  "record_number"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

end
