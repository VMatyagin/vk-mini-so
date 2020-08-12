import React, { FC } from "react";
import styled from "styled-components";
import { Title, Text, Button } from "@vkontakte/vkui";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";

interface BackgroundProps {
  src: string;
}
const BackgroundWrapper = styled.section<BackgroundProps>`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  flex-shrink: 0;
  width: 280px;
  height: 146px;
  border-radius: 6px;
  background: no-repeat url(${(props) => props.src});
  background-size: cover;
  background-position: right bottom;

  color: #fff;

  margin-right: 8px;
  padding: 16px;
  padding-right: 48px;

  overflow: hidden;
  :last-child {
    margin-right: 0;
  }
`;

export const BannerBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
`;

const MidTextPadding = styled.div`
  margin: 4px 0 16px 0;
`;

export interface BannerData {
  id: number;
  src: string;
  label: string;
  subLabel?: string;
}

interface BannerProps {
  data: BannerData;
  deleteClick: (id: number) => void;
}

export const Banner: FC<BannerProps> = ({ data, deleteClick }) => {
  const deleteBanner = () => {
    deleteClick(data.id);
  };
  return (
    <BackgroundWrapper src={data.src}>
      <BannerBtn>
        <Icon24Cancel onClick={deleteBanner} />
      </BannerBtn>
      <Title level="2" weight="bold">
        {data.label}
      </Title>
      <MidTextPadding>
        <Text weight="regular">{data.subLabel}</Text>
      </MidTextPadding>
      <Button href="#" mode="overlay_primary">
        Подробнее
      </Button>
    </BackgroundWrapper>
  );
};
