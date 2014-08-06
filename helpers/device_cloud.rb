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
          options.device_cloud['username'],
          options.device_cloud['password'],
          resource
        )

        case method
        when 'get'
          RestClient.get url, *args
        when 'post'
          RestClient.post url, *args 
        when 'put'
          RestClient.put url, *args
        when 'delete'
          RestClient.delete url, *args
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

        request_to_device_cloud 'put', 'ws/Monitor', post_dat.to_xml
      end
    end

    def self.registered(app)
      app.helpers DeviceCloud::Helpers

      app.set :device_cloud, YAML.load('config/device_cloud.yaml')
    end
  end

  register DeviceCloud
end
