require 'test_helper'

class WebBoardControllerTest < ActionController::TestCase
  test "should get board" do
    get :board
    assert_response :success
  end

end
