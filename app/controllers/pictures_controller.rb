  class PicturesController < ApplicationController
    def random_image
      pictures = [
        "https://www.fodors.com/wp-content/uploads/2022/10/Aramness_120.jpeg",
        "https://www.fodors.com/wp-content/uploads/2022/10/HOSHINOYA-Kyoto-Floating-Tearoom.jpeg",
        "https://www.fodors.com/wp-content/uploads/2022/10/Neelam-suite-front-shot-BHA_1601.jpeg",
        "https://www.fodors.com/wp-content/uploads/2022/10/High_resolution_300dpi-Jumeirah-Bali-Resort-Ocean-View.jpeg",
        "https://www.fodors.com/wp-content/uploads/2022/10/OODC_Infinity-Pool_1800x1200_01.jpeg",
        "https://www.fodors.com/wp-content/uploads/2022/10/0000412_0-2.jpeg",
        "https://www.fodors.com/wp-content/uploads/2022/10/Thakur_Bhagwati_Singh_Hot_Tub_Suite_9758-ORIGINAL.jpeg",
        "https://www.fodors.com/wp-content/uploads/2022/10/strMLEXRgr-206195-Sunset-Overwater-Villa-with-Pool-.jpeg"
      ]

      @random_picture = pictures.sample
    end
  end
