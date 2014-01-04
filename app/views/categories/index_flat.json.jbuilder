json.array!(@categories) do |category|
  json.extract! category, :id, :name, :description, :is_group
  json.certification category.certification, :id, :name
end