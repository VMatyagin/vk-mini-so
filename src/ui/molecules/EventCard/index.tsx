import { RichCell, Avatar, Caption, Headline } from "@vkontakte/vkui";
import React, { FC } from "react";
import { Event } from "../../../features/types";

interface EventCardProps
    extends Pick<Event, "title" | "description" | "startDate" | "startTime"> {
    onClick?: () => void;
}
export const EventCard: FC<EventCardProps> = ({
    onClick,
    description,
    title,
    startDate,
    startTime,
}) => {
    const time = startTime ? ` в ${startTime.substr(0, 5)}` : "";
    return (
        <RichCell
            onClick={onClick}
            before={
                <Avatar
                    mode="image"
                    size={72}
                    src={
                        "https://sun9-58.userapi.com/c855520/v855520362/22eea3/PJyKVJEONfA.jpg"
                    }
                />
            }
            text={
                description && (
                    <Caption
                        level="1"
                        weight="regular"
                        style={{ color: "#818C99" }}
                    >
                        {description}
                    </Caption>
                )
            }
            caption={
                startDate && (
                    <Caption
                        level="1"
                        weight="regular"
                        style={{ color: "#818C99" }}
                    >
                        {`${new Date(startDate).toLocaleString([], {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}${time}`}
                    </Caption>
                )
            }
            // after={<Icon24MoreVertical fill="var(--text_tertiary)" />}
        >
            <Headline weight="regular">{title}</Headline>
        </RichCell>
    );
};
