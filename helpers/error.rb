require 'sinatra/base'

module Sinatra
  module ErrorHelpers
    def halt_with_400_bad_request(message = nil)
      message ||= "Bad reqeuest"
      halt 400, { message: message}.to_json
    end

    def halt_with_404_not_found(message = nil)
      message ||= "Not found"
      halt 404, { message: message }.to_json
    end
  end

  helpers ErrorHelpers
end
