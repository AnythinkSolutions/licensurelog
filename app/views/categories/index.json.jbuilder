#json.array!(@categories) do |category|
#  json.extract! category, :id, :name, :description, :user_id, :required_hours, :supercategory, :certification
#  json.url category_url(category, format: :json)
#end

json.array!(@categories) do |category|
    json.partial! category
end
