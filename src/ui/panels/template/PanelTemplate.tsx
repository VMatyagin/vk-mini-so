import React, { FC } from "react";
import { Panel } from "@vkontakte/vkui";

interface TemplateProps {
  id: string;
}

export const PanelTemplate: FC<TemplateProps> = ({ id, children }) => {
  return <Panel id={id}>{children}</Panel>;
};
