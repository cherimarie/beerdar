class MapController < ApplicationController
  helper_method :get_user_location

  def index
    options = {
      current_location: get_user_location,
      open_now: (params[:view_all] == "y") ? false : true
    }
    @location_data = Location.get_marker_data(options)
  end

  def list
    location_data = Location.near(get_user_location).limit(params[:limit] || 50)
       .includes(:happy_hours)
       .includes(:happy_hours => :bargains)
    
    unless params[:view_all] == "y"
      @list_data = []
      location_data.each_with_index do |location, index|
        @list_data << location if location.has_open_happy_hour?
      end
    else
      @list_data = location_data
    end
  end

  def welcome;end

  private
    def get_user_location(as_string=false)
      if params[:address]
        geolocation = Geocoder.search(params[:address])
        lat_lng = [geolocation[0].latitude, geolocation[0].longitude]
      elsif cookies[:lat_lng]
        lat_lng = cookies[:lat_lng].split("|").map(&:to_f)
      elsif request.location
        lat_lng = [request.location.latitude, request.location.longitude]
      else
        flash[:no_location_found] = "No location found"
      end
      return lat_lng unless as_string
      return "#{lat_lng[0]}, #{lat_lng[1]}"
    end
end
