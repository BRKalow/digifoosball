require File.expand_path '../spec_helper.rb', __FILE__

describe "DigiFoosball App" do
  describe "Get '/'" do
    it "returns successful" do
      get '/'
      expect(last_response).to be_ok
    end
  end
end
