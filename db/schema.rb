# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140104131452) do

  create_table "categories", force: true do |t|
    t.string   "name"
    t.string   "description",      limit: 4080
    t.integer  "user_id"
    t.integer  "certification_id"
    t.integer  "required_hours"
    t.integer  "parent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "cap"
    t.boolean  "is_group",                      default: false, null: false
  end

  create_table "certifications", force: true do |t|
    t.string   "name"
    t.string   "description", limit: 4080
    t.integer  "user_id"
    t.date     "begin_date"
    t.date     "goal_date"
    t.date     "expire_date"
    t.string   "notes"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "workitems", force: true do |t|
    t.date     "date"
    t.integer  "user_id"
    t.integer  "category_id"
    t.integer  "certification_id"
    t.float    "hours"
    t.text     "notes"
    t.boolean  "signed_off",       default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
