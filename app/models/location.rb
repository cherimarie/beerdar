class Location < ActiveRecord::Base
  attr_accessible :address, :latitude, :longitude, :name, :version, :record_number
  has_many :happy_hours

end
