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
end
