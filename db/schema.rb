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

ActiveRecord::Schema.define(version: 20140105222917) do

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

  create_table "user_photos", force: true do |t|
    t.integer  "user_id",      null: false
    t.string   "description"
    t.string   "content_type", null: false
    t.string   "filename",     null: false
    t.binary   "image",        null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email",                  default: "", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",        default: 0,  null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

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
