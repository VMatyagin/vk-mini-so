import React, { FC } from "react";
import { PanelTemplate } from "../template/PanelTemplate";
import { PanelHeader } from "@vkontakte/vkui";

export const HomePanelBase: FC<{ id: string }> = ({ id }) => {
  return (
    <PanelTemplate id={id}>
      <PanelHeader>Examples 1</PanelHeader>
    </PanelTemplate>
  );
};
