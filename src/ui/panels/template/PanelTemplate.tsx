import React, { FC } from "react";
import { Panel } from "@vkontakte/vkui";
import { PanelProps } from "@vkontakte/vkui/dist/components/Panel/Panel";

export const PanelTemplate: FC<PanelProps> = ({ id, children, ...other }) => {
    return (
        <Panel id={id} {...other}>
            {children}
        </Panel>
    );
};
