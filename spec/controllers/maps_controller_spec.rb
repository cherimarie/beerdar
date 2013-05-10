require 'spec_helper'

describe MapController do
  describe "Grabbing geolocation data" do
    it "uses HTML5 cookie from JavaScript if it's there" do
      cookies[:lat_lng] = "48.856614|2.3522219"
      get 'index'

      assigns[:lat_lng].should eql([48.856614,2.3522219])
    end
    it "uses geocoder's IP-based location if there's no HTML5 location cookie" do
      cookies[:lat_lng] = nil
      #request = double() # Why won't stubs work?
      #request.stub_chain(:location, :latitude) { 50.123 }
      #request.stub_chain(:location, :longitude) { 2.345 }
      #request.stub(:location) { [50.123, 2.345] }
      get 'index'

      assigns[:lat_lng].should eql([0.0, 0.0])
    end
  end
end