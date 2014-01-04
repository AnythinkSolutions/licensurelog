class Category < ActiveRecord::Base
  #attr_accessible :name, :description, :required_hours, :parent_id, :certification_id, :user_id, :cap

  validates_presence_of :name, :certification_id, :user_id
  validates_uniqueness_of :name, :scope => [:certification_id, :user_id], :message => 'Category Names must be unique for a certification'

  belongs_to :user
  belongs_to :certification
  has_many :workitems

  # setup a self-join so that we have a hierarchy of categories.
  has_many :subcategories, class_name: "Category", foreign_key: "parent_id"
  belongs_to :supercategory, class_name: "Category", foreign_key: "parent_id"


end
