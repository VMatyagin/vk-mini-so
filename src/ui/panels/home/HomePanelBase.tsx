import React, { FC } from "react";
import { PanelTemplate } from "../template/PanelTemplate";
import { PanelHeader, Title, Group } from "@vkontakte/vkui";
import { BannerComponent } from "../../../feature/molecules/BannerComponent";
import { NewsComponent } from "../../../feature/molecules/NewsComponent";

export const HomePanelBase: FC<{ id: string }> = ({ id }) => {
  return (
    <PanelTemplate id={id}>
      <PanelHeader>
        <Title level="2" weight="bold">
          Привет, боец!
        </Title>
      </PanelHeader>
      <Group separator="hide">
        <BannerComponent />
      </Group>
      <Group separator="hide">
        <NewsComponent />
      </Group>
    </PanelTemplate>
  );
};
