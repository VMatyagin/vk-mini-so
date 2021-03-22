import { Icon24Chevron } from "@vkontakte/icons";
import { Avatar, SimpleCell, Gradient } from "@vkontakte/vkui";
import React, { FC } from "react";

interface ReportCategoryProps {
    title: string;
    description?: string;
    Icon: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
export const ReportCategory: FC<ReportCategoryProps> = ({
    onClick,
    description,
    title,
    Icon,
}) => {
    return (
        <SimpleCell
            onClick={onClick}
            style={{
                minHeight: 58,
            }}
            before={
                <Avatar size={44} shadow={false} mode="app">
                    <Gradient style={{ background: "transparent" }}>
                        {Icon}
                    </Gradient>
                </Avatar>
            }
            description={description}
            after={<Icon24Chevron />}
        >
            {title}
        </SimpleCell>
    );
};
