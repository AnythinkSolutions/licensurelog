json.extract! @certification, :name, :description, :user_id, :begin_date, :goal_date, :expire_date, :notes, :created_at, :updated_at

json.categories @categories do |cat|
    json.partial! cat
end

json.hours @certification.workitems do |wi|
   json.extract! wi, :date, :hours, :category_id, :certification_id, :notes, :signed_off
end
