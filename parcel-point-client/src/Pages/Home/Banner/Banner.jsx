import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import BannerImg1 from "../../../assets/banner/banner1.png";
import BannerImg2 from "../../../assets/banner/banner2.png";
import BannerImg3 from "../../../assets/banner/banner3.png";
import { Helmet } from "react-helmet";

const Banner = () => {
  return (
    <Carousel
      className="mt-5"
      showThumbs={false}
      showStatus={false}
      swipeable={true}
      autoPlay={true}
      infiniteLoop={true}
      interval={3000}
    >
      <div>
        <Helmet>
          <title>Parcel Point | Home</title>
        </Helmet>
        <img src={BannerImg1} />
      </div>
      <div>
        <img src={BannerImg2} />
      </div>
      <div>
        <img src={BannerImg3} />
      </div>
    </Carousel>
  );
};

export default Banner;
