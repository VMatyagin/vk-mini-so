import React, { FC } from "react";
import styled from "styled-components";
import { WallWallpostFull } from "../../../../api";
import { Caption, Group, Headline, Text } from "@vkontakte/vkui";
import { PanelWrapper } from "../../../ui/molecules/PanelWrapper";

interface WallPostProps {
  id: number;
  date: number;
  text: string;
  likes: number;
  comments: number;
  attachments:
    | [
        {
          type: string;
          [key: string]: any;
        }
      ]
    | null;
}

const Image = styled.img`
  width: 100%;
  height: 224px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;

  :last-child {
    margin-right: 0;
  }
`;
export const WallPost: FC<WallWallpostFull> = ({
  id,
  likes,
  comments,
  text,
  attachments,
}) => {
  let imgUrl;
  if (attachments && attachments.filter((item) => item.type === "photo")) {
    imgUrl = attachments
      .find((item) => item.type === "photo")
      ?.photo?.sizes?.find((size) => size.type === "r")?.url;
  }
  const regex = /.*?(\.)(?=\s[а-яА-Я])/;
  const hasgtagRegex = /#[0-9A-Za-zА-Яа-яё]+/g;
  return (
    <PanelWrapper>
      <Group separator="show">
        {imgUrl && <Image height={224} width={320} src={imgUrl} />}
        <Group
          style={{
            padding: "0 16px 0 16px",
          }}
        >
          <Caption weight="medium" level="3" caps>
            {hasgtagRegex.exec(text ? text : "")}
          </Caption>
          <Headline weight="medium">{regex.exec(text ? text : "")}</Headline>
          <Text weight="regular">{text}</Text>
        </Group>
      </Group>
    </PanelWrapper>
  );
};
