json.array!(@workitems) do |workitem|
  json.extract! workitem, :date, :category_id, :certification_id, :hours, :notes, :signed_off
  #json.url workitem_url(workitem, format: :json)
end
