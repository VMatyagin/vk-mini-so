import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { Banner, BannerData } from "../../../ui/molecules/Banner";
import { HorizontalScroll } from "@vkontakte/vkui";

const data = [
  {
    id: 1,
    label: "Привет, Андрей!",
    subLabel: "Самое романтическое мероприятие СПбСО",
    src:
      "https://sun9-53.userapi.com/m-ygfKiLKLkEMAQVTToO2l9LyC6GgqWoGXpw8A/-zm6_XLECTU.jpg",
  },
  {
    id: 2,
    label: "Бал СПбСО",
    subLabel: "Самое романтическое мероприятие СПбСО",
    src:
      "https://sun9-53.userapi.com/m-ygfKiLKLkEMAQVTToO2l9LyC6GgqWoGXpw8A/-zm6_XLECTU.jpg",
  },
];

const BannerWrapper = styled.article`
  display: flex;
  align-items: stretch;
  ::before,
  ::after {
    content: "";
    display: block;
    flex-shrink: 0;
    width: 16px;
  }
`;

export const BannerComponent = () => {
  const [banners, setBanners] = useState<BannerData[] | null>(null);

  useEffect(() => {
    setBanners(data);
  }, []);
  const handleDeleteClick = (id: number) => {
    setBanners(banners!.filter((banner) => banner.id !== id));
  };

  return (
    <HorizontalScroll>
      <BannerWrapper>
        {banners &&
          banners.map((banner) => {
            return (
              <Banner
                key={banner.id}
                data={banner}
                deleteClick={handleDeleteClick}
              />
            );
          })}
      </BannerWrapper>
    </HorizontalScroll>
  );
};
