class User < ActiveRecord::Base
    attr_accessor :name, :email, :wins, :losses, :department

    has_many :games
end
