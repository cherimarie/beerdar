class MapController < ApplicationController
  def index
    options = {
      current_location: get_user_location,
      open_now: (params[:view_all] == "y") ? false : true
    }
    @location_data = Location.get_marker_data(options)
  end

  def list
    @list_data = Location.near(get_user_location)
     .includes(:happy_hours)
     .includes(:happy_hours => :bargains)


  end

  private
    def get_user_location
      #return @lat_lng if @lat_lng
      if cookies[:lat_lng]
        lat_lng = cookies[:lat_lng].split("|").map(&:to_f)
      elsif request.location
        lat_lng = [request.location.latitude, request.location.longitude]
      else
        flash[:no_location_found] = "No location found"
      end
      lat_lng
    end
end
