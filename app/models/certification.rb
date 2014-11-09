class Certification < ActiveRecord::Base
  #attr_accessible :name, :description, :user_id, :begin_date, :goal_date, :expire_date

  validates_presence_of :name, :user_id, :begin_date

  has_many :categories
  has_many :workitems
  belongs_to :user

  def self.update_with_dates(params)

    if params[:begin_date] && (params[:begin_date].is_a? String)
      params[:begin_date] = DateTime.parse(params[:begin_date])
    end

    if params[:expire_date] && (params[:expire_date].is_a? String)
      params[:expire_date] = DateTime.parse(params[:expire_date])
    end

    if params[:goal_date] && (params[:goal_date].is_a? String)
      params[:goal_date] = DateTime.parse(params[:goal_date])
    end

    self.update(params)

  end

  def self.create_from_template(user_id, template_id)

    #template id is negative, so if necessary, multiply the value by -1
    template_id = template_id > 0 ? template_id * -1 : template_id

    template_cert = Certification.find(template_id)
    cert = Certification.create!({
        :name => template_cert.name,
        :description => template_cert.description,
        :begin_date => DateTime.now,
        :user_id => user_id
                                 })

    template_categories = Category.where(:certification_id => template_id)
    list = {}

    #create all the categories first
    template_categories.each do |c|
      cat = Category.create!({
          :certification_id => cert.id,
          :user_id => user_id,
          :name => c.name,
          :description => c.description,
          :required_hours => c.required_hours,
          :cap => c.cap,
          :is_group => c.is_group})

      list[c.id] = cat
    end

    #now, go through and figure out which ones are children of another one
    template_categories.each do |c|
      if c.parent_id.present?
        list[c.id].update_attributes!({:parent_id => list[c.parent_id].id})
      end
    end

    #return the certification
    cert

  end



end
