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

ActiveRecord::Schema.define(version: 20140903181213) do

  create_table "games", force: true do |t|
    t.integer  "player_home_id"
    t.integer  "player_away_id"
    t.integer  "score_home"
    t.integer  "score_away"
    t.string   "score_history"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "finished"
    t.integer  "home_rating_change"
    t.integer  "away_rating_change"
    t.integer  "league_game"
    t.integer  "manual"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "department"
    t.integer  "wins"
    t.integer  "losses"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "games_played"
    t.integer  "goals_scored"
    t.integer  "goals_given"
    t.integer  "time_played"
    t.string   "gravatar"
    t.integer  "rating"
  end

end
