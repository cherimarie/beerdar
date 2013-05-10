class MapController < ApplicationController
  def index
    @lat_lng = get_user_location
  end

  private
    def get_user_location
      return @lat_lng if @lat_lng
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
