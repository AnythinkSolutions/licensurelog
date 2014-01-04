json.extract! category, :id, :name, :description, :required_hours, :cap, :parent_id, :certification_id, :is_group
json.certification category.certification, :id, :name, :description

if category.subcategories.length > 0

    json.subcategories category.subcategories do |json, subcat|
        json.partial! subcat
    end
end