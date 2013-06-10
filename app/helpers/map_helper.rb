module MapHelper
  def pretty_weekdays(days)
    day_array = days.split("")
    if day_array.length == 7
      return "Daily"
    end
    if day_array.length > 7
      return "TOO MANY DAYS"
    end
    day_array.map! do |day|
      case day
      when "U"
        "Sun"
      when "M"
        "Mon"
      when "T"
        "Tue"
      when "W"
        "Wed"
      when "H"
        "Thur"
      when "F"
        "Fri"
      when "S"
        "Sat"
      end
    end
    return day_array.join(", ")
  end

  def obvs_addy(address)
    addy_array = address.split(",")
    return addy_array[0]
  end

  def static_marker(location, label, color = "green")
    return "" unless location
    return "&markers=color:#{color}%7Clabel:#{label}%7C#{location.latitude},#{location.longitude}"
  end

  def mass_markers(location_data, number = 10)
    number = 26 if number > 26
    return_string = ""
    number.times do |index|
      return_string << static_marker(location_data[index], (index + 65).chr)
    end
    return_string
  end
  
  # &markers=color:blue%7Clabel:S%7C40.702147,-74.015794
end
