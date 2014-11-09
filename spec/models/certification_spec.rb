require 'spec_helper'

describe Certification do
  it "should create a certification plan from a template" do

    #Create a template
    temp_id = -99
    user_id = -99
    Certification.create!({
                              :id => temp_id,
                              :name => 'Cert Template',
                              :description => 'A Test template for a certification',
                              :user_id => user_id,
                              :begin_date => DateTime.now
                          })

    Category.create!({
                         :certification_id => temp_id,
                         :user_id => user_id,
                         :name => 'Category One',
                         :description => 'First Category in this template',
                         :required_hours => 100,
                         :cap => 200
                     })

    cert = Certification.create_from_template(-5, temp_id)

    cert.id.should_not == -99
    cert.user_id.should == -5

    categories = Category.where(:certification_id => cert.id)
    categories.count.should == 1
    categories.first.user_id.should == -5
    categories.first.name.should == 'Category One'
    categories.first.required_hours.should == 100
    categories.first.cap.should == 200

  end

  it "should create a certification plan with multiple categories from a template" do

    #Create a template
    temp_id = -99
    user_id = -99
    Certification.create!({
                              :id => temp_id,
                              :name => 'Cert Template',
                              :description => 'A Test template for a certification',
                              :user_id => user_id,
                              :begin_date => DateTime.now
                          })

    Category.create!({
                         :certification_id => temp_id,
                         :user_id => user_id,
                         :name => 'Category One',
                         :description => 'First Category in this template',
                         :required_hours => 100,
                         :cap => 200
                     })

    Category.create!({
                         :certification_id => temp_id,
                         :user_id => user_id,
                         :name => 'Category Two',
                         :description => 'Second Category in this template',
                         :required_hours => 200,
                         :cap => 300
                     })

    cert = Certification.create_from_template(-5, temp_id)

    cert.id.should_not == -99
    cert.user_id.should == -5

    categories = Category.where(:certification_id => cert.id)
    categories.count.should == 2
    cat1 = categories[0]
    cat2 = categories[1]

    cat1.user_id.should == -5
    cat1.name.should == 'Category One'
    cat1.required_hours.should == 100
    cat1.cap.should == 200

    cat2.user_id.should == -5
    cat2.name.should == 'Category Two'
    cat2.required_hours.should == 200
    cat2.cap.should == 300

  end

  it "should create a certification plan with children categories from a template" do

    #Create a template
    temp_id = -99
    user_id = -99
    Certification.create!({
                              :id => temp_id,
                              :name => 'Cert Template',
                              :description => 'A Test template for a certification',
                              :user_id => user_id,
                              :begin_date => DateTime.now
                          })

    pCat = Category.create!({
                         :certification_id => temp_id,
                         :user_id => user_id,
                         :name => 'Category One',
                         :description => 'First Category in this template',
                         :required_hours => 100,
                         :cap => 200
                     })

    Category.create!({
                         :certification_id => temp_id,
                         :user_id => user_id,
                         :name => 'Category Two',
                         :description => 'Second Category in this template',
                         :required_hours => 200,
                         :cap => 300,
                         :parent_id => pCat.id
                     })

    cert = Certification.create_from_template(-5, temp_id)

    cert.id.should_not == -99
    cert.user_id.should == -5

    categories = Category.where(:certification_id => cert.id)
    categories.count.should == 2
    cat1 = categories[0]
    cat2 = categories[1]

    cat1.user_id.should == -5
    cat1.name.should == 'Category One'
    cat1.required_hours.should == 100
    cat1.cap.should == 200
    cat1.parent_id.should == nil

    cat2.user_id.should == -5
    cat2.name.should == 'Category Two'
    cat2.required_hours.should == 200
    cat2.cap.should == 300
    cat2.parent_id.should == cat1.id

  end

  it "should create a certification plan with multiple children categories from a template" do

    #Create a template
    temp_id = -99
    user_id = -99
    Certification.create!({
                              :id => temp_id,
                              :name => 'Cert Template',
                              :description => 'A Test template for a certification',
                              :user_id => user_id,
                              :begin_date => DateTime.now
                          })

    pCat = Category.create!({
                                :certification_id => temp_id,
                                :user_id => user_id,
                                :name => 'Category One',
                                :description => 'First Category in this template',
                                :required_hours => 100,
                                :cap => 200
                            })

    Category.create!({
                         :certification_id => temp_id,
                         :user_id => user_id,
                         :name => 'Category Two',
                         :description => 'Second Category in this template',
                         :required_hours => 200,
                         :cap => 300,
                         :parent_id => pCat.id
                     })
    pCat2 = Category.create!({
                                :certification_id => temp_id,
                                :user_id => user_id,
                                :name => 'Category Three',
                                :description => 'Third Category in this template',
                                :required_hours => 300,
                                :cap => 400
                            })

    Category.create!({
                         :certification_id => temp_id,
                         :user_id => user_id,
                         :name => 'Category Four',
                         :description => 'Fourth Category in this template',
                         :required_hours => 400,
                         :cap => 500,
                         :parent_id => pCat2.id
                     })

    cert = Certification.create_from_template(-5, temp_id)

    cert.id.should_not == -99
    cert.user_id.should == -5

    categories = Category.where(:certification_id => cert.id)
    categories.count.should == 4
    cat1 = categories[0]
    cat2 = categories[1]
    cat3 = categories[2]
    cat4 = categories[3]

    cat1.user_id.should == -5
    cat1.name.should == 'Category One'
    cat1.required_hours.should == 100
    cat1.cap.should == 200
    cat1.parent_id.should == nil

    cat2.user_id.should == -5
    cat2.name.should == 'Category Two'
    cat2.required_hours.should == 200
    cat2.cap.should == 300
    cat2.parent_id.should == cat1.id

    cat3.user_id.should == -5
    cat3.name.should == 'Category Three'
    cat3.required_hours.should == 300
    cat3.cap.should == 400
    cat3.parent_id.should == nil

    cat4.user_id.should == -5
    cat4.name.should == 'Category Four'
    cat4.required_hours.should == 400
    cat4.cap.should == 500
    cat4.parent_id.should == cat3.id

  end

  it "should create a certification plan with multiple children for the same parent category from a template" do

    #Create a template
    temp_id = -99
    user_id = -99
    Certification.create!({
                              :id => temp_id,
                              :name => 'Cert Template',
                              :description => 'A Test template for a certification',
                              :user_id => user_id,
                              :begin_date => DateTime.now
                          })

    pCat = Category.create!({
                                :certification_id => temp_id,
                                :user_id => user_id,
                                :name => 'Category One',
                                :description => 'First Category in this template',
                                :required_hours => 100,
                                :cap => 200
                            })

    Category.create!({
                         :certification_id => temp_id,
                         :user_id => user_id,
                         :name => 'Category Two',
                         :description => 'Second Category in this template',
                         :required_hours => 200,
                         :cap => 300,
                         :parent_id => pCat.id
                     })
    Category.create!({
                                 :certification_id => temp_id,
                                 :user_id => user_id,
                                 :name => 'Category Three',
                                 :description => 'Third Category in this template',
                                 :required_hours => 300,
                                 :cap => 400,
                                 :parent_id => pCat.id
                             })

    cert = Certification.create_from_template(-5, temp_id)

    cert.id.should_not == -99
    cert.user_id.should == -5

    categories = Category.where(:certification_id => cert.id)
    categories.count.should == 3
    cat1 = categories[0]
    cat2 = categories[1]
    cat3 = categories[2]

    cat1.user_id.should == -5
    cat1.name.should == 'Category One'
    cat1.required_hours.should == 100
    cat1.cap.should == 200
    cat1.parent_id.should == nil

    cat2.user_id.should == -5
    cat2.name.should == 'Category Two'
    cat2.required_hours.should == 200
    cat2.cap.should == 300
    cat2.parent_id.should == cat1.id

    cat3.user_id.should == -5
    cat3.name.should == 'Category Three'
    cat3.required_hours.should == 300
    cat3.cap.should == 400
    cat3.parent_id.should == cat1.id

  end
end