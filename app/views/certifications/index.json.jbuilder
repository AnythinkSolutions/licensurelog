json.array!(@certifications) do |certification|
  json.extract! certification, :id, :name, :description, :user_id, :begin_date, :goal_date, :expire_date, :notes
  json.url certification_url(certification, format: :json)
end
