class User < ActiveRecord::Base

  #attr_accessible :name, :email

  has_many :certifications
  has_many :categories
  has_many :workitems

end
