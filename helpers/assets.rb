require 'sinatra/base'

module Sinatra
  module Assets
    def include_js_folders(folders)
      result = ""
      if(!folders.kind_of? Array)
        # this ensures we are dealing with an array
        folders = folders.split(" ")
      end

      folders.each do |folder|
        Dir["#{Dir.getwd}/public/#{folder}/*.js"].each do |file|
          result = result + "  <script type=\"text/javascript\" src=\"" +
                            "#{folder}/#{File.basename(file)}\"></script>\n"
        end
      end

      return result
    end

    def include_js_files(files)
      result = ""
      if(!files.kind_of? Array)
        # this ensures we are dealing with an array
        files = files.split(" ")
      end

      files.each do |file|
        result = result + "  <script type=\"text/javascript\" src=\"" +
                          "#{file}\"></script>\n"
      end
      
      return result
    end
  end

  helpers Assets
end

