class Certification < ActiveRecord::Base
  #attr_accessible :name, :description, :user_id, :begin_date, :goal_date, :expire_date

  validates_presence_of :name, :user_id, :begin_date

  has_many :categories
  has_many :workitems
  belongs_to :user

  def self.update_with_dates(params)

    if params[:begin_date] && (params[:begin_date].is_a? String)
      params[:begin_date] = DateTime.parse(params[:begin_date])
    end

    if params[:expire_date] && (params[:expire_date].is_a? String)
      params[:expire_date] = DateTime.parse(params[:expire_date])
    end

    if params[:goal_date] && (params[:goal_date].is_a? String)
      params[:goal_date] = DateTime.parse(params[:goal_date])
    end

    self.update(params)

  end

end
