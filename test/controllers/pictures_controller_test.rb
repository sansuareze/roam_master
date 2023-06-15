require "test_helper"

class PicturesControllerTest < ActionDispatch::IntegrationTest
  test "should get random_image" do
    get pictures_random_image_url
    assert_response :success
  end
end
