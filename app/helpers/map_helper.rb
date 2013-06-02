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
        "Sunday"
      when "M"
        "Monday"
      when "T"
        "Tuesday"
      when "W"
        "Wednesday"
      when "H"
        "Thursday"
      when "F"
        "Friday"
      when "S"
        "Saturday"
      end
    end
    return day_array.join(", ")
  end
end
