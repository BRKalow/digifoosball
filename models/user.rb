class User < ActiveRecord::Base
    attr_accessor :name, :email, :wins, :losses, :department

    has_many :games

    after_initialize :set_defaults

    def set_defaults
      self.name ||= 'John'
      self.email ||= 'john.doe@example.com'
      self.wins ||= 0
      self.losses ||= 0
      self.department ||= 'General'
    end
end
