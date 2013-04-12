class HappyHour < ActiveRecord::Base
  has_many :bargains
  belongs_to :location, dependent: :destroy
  attr_accessible :days, :end_time, :name, :start_time, :version, :record_number

end
