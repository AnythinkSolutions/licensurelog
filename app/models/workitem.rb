class Workitem < ActiveRecord::Base
  #attr_accessible :date, :user_id, :category_id, :certification_id, :hours, :notes

  validates_presence_of :user_id, :category_id, :certification_id, :date, :hours
  validates_uniqueness_of :date, :scope => [:user_id, :category_id, :certification_id], :message => 'Only one hours entry per date and category is allowed'

  belongs_to :user
  belongs_to :category
  belongs_to :certification

end
