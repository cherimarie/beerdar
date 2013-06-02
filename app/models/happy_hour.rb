class HappyHour < ActiveRecord::Base
  has_many :bargains, dependent: :destroy
  belongs_to :location
  attr_accessible :days, :end_time, :name, :start_time, :version, :record_number, :same_bargains
  scope :open_today, -> { where("days like '%#{self.todays_letter}%'") }

  def show_bargains
    if same_bargains
    begin
      Bargain.where('happy_hour_id = ?', same_bargains).all
    rescue ActiveRecord::RecordNotFound
      [ Bargain.new { |x| x.deal = "same_bargain is not valid happy hour id. Happy Hour not found" } ]
    end
    else
      bargains
    end
  end

  def self.todays_letter
    day_of_the_week = Time.now.wday
    case day_of_the_week
    when 0
      "U" #Sunday
    when 1
      "M" #Monday
    when 2
      "T" #Tuesday
    when 3
      "W" #Wednesday
    when 4
      "H" #Thursday
    when 5
      "F" #Friday
    when 6
      "S" #Saturday
    end
  end

  def open_now?
    open_today? && open_at_this_time?
  end  

  def open_today?
    days.include?(HappyHour.todays_letter) # Will need to change to account for happy hours after midnight.
  end                                      # It'll return false negatives when you're 12am+ on a day not 
                                           # specifically listed in the days attribute

  def open_at_this_time?
    time_inside?(Time.now.utc, start_time.utc, end_time.utc)
  end
  
private
# converts datetime object to float containing the time w/ minutes as decimals (e.g. 5:30 => 5.30)
  def t2f(time) 
    time.strftime('%H.%M').to_f
  end

  def time_inside?(time, start, stop)
    if t2f(stop) < t2f(start)
      if t2f(time) >= t2f(start)
        t2f(time) >= t2f(stop)
      elsif t2f(time) <= t2f(start)
        t2f(time) <= t2f(stop)
      end
    else
      t2f(start) < t2f(time) && t2f(time) < t2f(stop) 
    end
  end
end