class Location < ActiveRecord::Base
  attr_accessible :address, :latitude, :longitude, :name, :version, :record_number
  has_many :happy_hours
  geocoded_by :address
  after_validation :geocode, :if => :address_changed?

  def self.get_marker_data(options={})
    defaults = {
      current_location: "The Space Needle, Seattle, WA",
      limit: 10
    }
    options = defaults.merge(options)
    locations = Location.near(options[:current_location]).limit(options[:limit])
    get_location_hash(locations)
  end

private
  def self.get_location_hash(locations)
    return_data = Hash.new
    locations.each_with_index do |location, location_index|
      happy_hour_hash = Hash.new
      location.happy_hours.each_with_index do |happy_hour, happy_hour_index|
        bargain_hash = Hash.new
        happy_hour.bargains.each_with_index do |bargain, bargain_index|
          bargain_hash[bargain_index] = {
            "deal" => bargain.deal,
            "deal_type" => bargain.deal_type,
            "id" => bargain.id
          }
        end
        happy_hour_hash[happy_hour_index] = {
          "name" => happy_hour.name,
          "start_time" => happy_hour.start_time, # We probably need to fix this up to
          "end_time" => happy_hour.end_time,     # handle different time zones properly
          "days" => happy_hour.days,
          "id" => happy_hour.id,
          "bargains" => bargain_hash
        }
      end
      return_data[location_index] = {
        "name" => location.name,
        "address" => location.address,
        "longitude" => location.longitude,
        "latitude" => location.latitude,
        "id" => location.id,
        "happy_hours" => happy_hour_hash
      }
    end
    return_data
  end
end