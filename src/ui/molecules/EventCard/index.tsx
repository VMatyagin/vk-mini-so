import { RichCell, Avatar, Caption, Headline } from "@vkontakte/vkui";
import Icon24MoreVertical from "@vkontakte/icons/dist/24/more_vertical";
import React, { FC } from "react";
interface EventCardProps {
    onClick?: () => void;
}
export const EventCard: FC<EventCardProps> = ({ onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };
    return (
        <RichCell
            onClick={handleClick}
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
                <Caption
                    level="1"
                    weight="regular"
                    style={{ color: "#818C99" }}
                >
                    Кинозал «Апрель», м. Выборгская
                </Caption>
            }
            caption={
                <Caption
                    level="1"
                    weight="regular"
                    style={{ color: "#818C99" }}
                >
                    18:00 — 21:00
                </Caption>
            }
            after={<Icon24MoreVertical fill="var(--text_tertiary)" />}
        >
            <Headline weight="regular">Фестиваль СО 2020</Headline>
        </RichCell>
    );
};
