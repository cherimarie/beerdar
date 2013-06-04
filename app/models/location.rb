class Location < ActiveRecord::Base
  attr_accessible :address, :latitude, :longitude, :name, :version, :record_number
  has_many :happy_hours, dependent: :destroy
  geocoded_by :address
  after_validation :geocode, :if => :address_changed?

  def self.get_marker_data(options={})
    defaults = {
      current_location: "The Space Needle, Seattle, WA",
      limit: 100,
      open_now: true
    }
    options = defaults.merge(options)
    locations = Location
      .near(options[:current_location])
      .limit(options[:limit])
      .includes(:happy_hours)
      .includes(:happy_hours => :bargains)
    get_location_hash(locations, options)
  end

  def has_open_happy_hour?
    return_bool = false
    happy_hours.each do |happy_hour|
      return_bool = true if happy_hour.open_now?
    end
    return_bool
  end

private
  def self.get_location_hash(locations, options)
    return_data = Hash.new
    locations.each_with_index do |location, location_index|
      if !options[:open_now] || location.has_open_happy_hour?
        happy_hour_hash = Hash.new
        location.happy_hours.each_with_index do |happy_hour, happy_hour_index|
          if !options[:open_now] || happy_hour.open_now?
            bargain_hash = Hash.new
            happy_hour.show_bargains.each_with_index do |bargain, bargain_index|
              bargain_hash[bargain_index] = {
                "deal" => bargain.deal,
                "deal_type" => bargain.deal_type,
                "id" => bargain.id
              }
            end
            happy_hour_hash[happy_hour_index] = {
              "name" => happy_hour.name,
              "start_time" => happy_hour.start_time.strftime('%-l:%M %p'), # We probably need to fix this up to
              "end_time" => happy_hour.end_time.strftime('%-l:%M %p'),     # handle different time zones properly
              "days" => happy_hour.days,
              "id" => happy_hour.id,
              "bargains" => bargain_hash
            }
          end
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
    end
    return_data
  end

#if !options[:open_now] || happy_hour.open_now?

end