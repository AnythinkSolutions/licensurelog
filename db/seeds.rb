# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

#only necessary when debugging
# require File.expand_path(File.dirname(__FILE__) + "/../config/environment")

cert_type = -1    #LCSW
user_id = -1

#Check to see if we have a template for the certification itself
if Certification.where('id < 0').count == 0
  Certification.create!({
      :id => cert_type,
      :name => 'LCSW',
      :description => 'Licensed Clinical Social Worker in Colorado',
      :user_id => user_id,
      :begin_date => DateTime.now
                        })
end

#Check to see if we have the certification templates defined, and if not
# add them
if Category.where('certification_id < 0').count == 0

  Category.create!({
                       :certification_id => cert_type,
                       :user_id => user_id,
                       :name => 'Work Experience Hours',
                       :description => 'Includes a professional relationship that involves treatment, diagnosis, testing, assessment, or counseling.',
                       :required_hours => 1680,
                       :cap => 3360
                   })

  Category.create!({
                       :certification_id => cert_type,
                       :user_id => user_id,
                       :name => 'Other Duties',
                       :description => 'defined by CRS 12-43-403.',
                       :required_hours => 1680,
                       :cap => 1680
                   })

  sup = Category.create!({
                       :certification_id => cert_type,
                       :user_id => user_id,
                       :name => 'Individual Supervision',
                       :required_hours => 48,
                       :cap => 96,
                       :is_group => true
                   })

  Category.create!({
                       :certification_id => cert_type,
                       :user_id => user_id,
                       :name => 'Face to Face',
                       :required_hours => 48,
                       :cap => 96,
                       :parent_id => sup.id
                   })

  Category.create!({
                       :certification_id => cert_type,
                       :user_id => user_id,
                       :name => 'Phone, Skype, etc.',
                       :required_hours => 48,
                       :cap => 96,
                       :parent_id => sup.id
                   })

  Category.create!({
                       :certification_id => cert_type,
                       :user_id => user_id,
                       :name => 'Group Supervision',
                       :required_hours => 48,
                       :cap => 48
                   })
end
