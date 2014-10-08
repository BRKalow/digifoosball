require 'sinatra/base'

require 'yaml'
require 'nokogiri'
require 'rest-client'

module Sinatra
  module DeviceCloud

    module Helpers
      def build_base_url(user, pass, resource)
        return "https://#{user}:#{pass}@login.etherios.com/#{resource}/"
      end

      def request_to_device_cloud(method, resource, *args)
        url = build_base_url(
          settings.device_cloud['username'],
          settings.device_cloud['password'],
          resource
        )
        method_sym = method.to_sym
        begin
          RestClient.send(method_sym, url, *args)
        rescue NoMethodError
          puts "Invalid method passed to RestClient through"
               "reqest_to_device_cloud"
        end
      end

      def create_monitor(topic, url, auth_user, auth_pass)
        post_data = Nokogiri::XML::Builder.new do |xml|
          xml.Monitor {
            xml.monTopic = topic
            xml.monTransportType = 'http'
            xml.monTransportUrl = url
            xml.monTransportToken = [auth_user, auth_pass].join ':'
            xml.monFormatType = 'json'
          }
        end

        request_to_device_cloud 'post', 'ws/Monitor', post_data.to_xml
      end

      def ping_monitor(monitor_id)
        post_data = Nokogiri::XML::Builder.new do |xml|
          xml.Monitor {
            xml.monId = monitor_id
          }
        end

        request_to_device_cloud 'put', 'ws/Monitor', post_data.to_xml
      end

      def parse_dc_response(data, previous_value)
        input = data["streamId"].split('/')[3]
        value = data["data"]
        should_increment_score = (value == 1 && previous_value != 1)
        latest_game = Game.first
        id = 0

        if latest_game
          if (latest_game.finished == 1)
            should_increment_score = false 
          end
          id = latest_game.id
        end

        parsed = Hash.new; parsed = {
          :team => (input == settings.device_cloud['home_input'] ? 'home' : 'away'),
          :should_increment_score => should_increment_score,
          :id => id,
          :value => value
        }
      end
    end

    def self.registered(app)
      app.helpers DeviceCloud::Helpers

      if File.file?('/config/device_cloud.yml')
        app.set :device_cloud, YAML.load_file('config/device_cloud.yml')
      else
        device_cloud_hash = Hash.new

        device_cloud_hash = {
          'username' => ENV['dc_username'],
          'password' => ENV['dc_password'],
          'device_id' => ENV['dc_device_id'],
          'home_input' => ENV['dc_home_input'],
          'away_input' => ENV['dc_away_input']
        }

        app.set :device_cloud, device_cloud_hash
      end
    end
  end

  register DeviceCloud
end
