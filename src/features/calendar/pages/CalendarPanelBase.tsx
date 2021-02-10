import React, { FC, useState } from "react";
import { PanelTemplate } from "../../../ui/panels/template/PanelTemplate";
import { Touch } from "@vkontakte/vkui";
import {
    PanelHeader,
    Title,
    Div,
    List,
    PanelHeaderButton,
    Headline,
} from "@vkontakte/vkui";
import Icon28InfoOutline from "@vkontakte/icons/dist/28/info_outline";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import subDays from "date-fns/subDays";
import getDate from "date-fns/getDate";
import getMonth from "date-fns/getMonth";
import ru from "date-fns/locale/ru";
import { Gesture } from "@vkontakte/vkui/dist/components/Touch/Touch";
import { useMst } from "../../stores";
import { EventCard } from "../../../ui/molecules/EventCard";

registerLocale("ru", ru);
const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];

const CalendarStyles = styled.div`
    .react-datepicker {
        width: 100%;
        border: none;
        font-family: inherit;
    }
    .react-datepicker__month-container {
        display: block;
        float: none;
        width: 100%;
    }
    .react-datepicker__header {
        border: none;
        margin: 0.4rem;
        background: none;
    }
    .react-datepicker__week,
    .react-datepicker__day-names {
        display: flex;
        justify-content: space-between;
        text-transform: uppercase;
    }
    .react-datepicker__day,
    .react-datepicker__day-name {
        display: flex;
        justify-content: center;
        position: relative;
        color: #444444;
        width: 44px;
        height: 44px;
        margin: 0;
        color: var(--text_muted);
    }
    .react-datepicker__day-name {
        align-items: center;
        color: #999;
        font-size: 16px;
    }
    .react-datepicker__day--selected {
        background: var(--accent);
        border: 1px solid #0083e2;
        box-sizing: border-box;
        border-radius: 70px;
        color: white;
        outline: none;
    }
    .react-datepicker__day--highlighted-custom-1 {
    }
    .react-datepicker__day--outside-month {
        color: #cccccc;
    }
    .react-datepicker__day--today {
        box-sizing: border-box;
        border-radius: 22px;
        border: 2px rgba(204, 204, 204, 0.5) solid;
    }
    .react-datepicker__header {
        text-transform: capitalize;
        margin: 0;
    }
    .react-datepicker__month {
        margin: 0;
    }
    .Icon {
        color: var(--accent);
    }
`;

const DayContent = styled.div`
    display: flex;
    padding-top: 10px;
`;

const renderDayContents = (day: number, date: Date) => {
    return (
        <DayContent>
            <Headline weight="medium">{getDate(date)}</Headline>
        </DayContent>
    );
};

interface TouchContainerProps {
    goPrev: () => void;
    goNext: () => void;
}
const TouchContainer: FC<TouchContainerProps> = ({
    children,
    goPrev,
    goNext,
}) => {
    const handleMove = (e: Gesture) => {
        if (e.isSlideX && e.shiftXAbs && e.shiftXAbs > 50) {
            if (e.shiftX! > 0) {
                goNext();
            } else {
                goPrev();
            }
        }
    };
    return <Touch onMove={handleMove}>{children}</Touch>;
};
export const CalendarPanelBase: FC<{ id: string }> = ({ id }) => {
    const [startDate, setStartDate] = useState(new Date());
    let nextMonth = () => {};
    let prevMonth = () => {};
    const store = useMst();
    const highlightWithRanges = [
        {
            "react-datepicker__day--highlighted-custom-1": [
                subDays(new Date(), 4),
                subDays(new Date(), 3),
                subDays(new Date(), 2),
                subDays(new Date(), 1),
            ],
        },
    ];
    const handleClickInfo = () => {
        store.router.openModal("MODAL_CALENDAR_INFO");
    };
    return (
        <PanelTemplate id={id}>
            <PanelHeader
                left={
                    <PanelHeaderButton onClick={handleClickInfo}>
                        <Icon28InfoOutline />
                    </PanelHeaderButton>
                }
            >
                <Title level="2" weight="bold">
                    Календарь
                </Title>
            </PanelHeader>
            <Div>
                <CalendarStyles>
                    <DatePicker
                        locale="ru"
                        selected={startDate}
                        onChange={(date: Date) => setStartDate(date)}
                        inline
                        highlightDates={highlightWithRanges}
                        renderDayContents={renderDayContents}
                        disabledKeyboardNavigation
                        calendarContainer={({ children }) => (
                            <TouchContainer
                                goNext={nextMonth}
                                goPrev={prevMonth}
                            >
                                {children}
                            </TouchContainer>
                        )}
                        renderCustomHeader={({
                            date,
                            decreaseMonth,
                            increaseMonth,
                        }) => {
                            prevMonth = increaseMonth;
                            nextMonth = decreaseMonth;
                            return (
                                <Headline weight="medium">
                                    {months[getMonth(date)]}
                                </Headline>
                            );
                        }}
                    />
                </CalendarStyles>
            </Div>

            <Div>
                <List>
                    <EventCard onClick={() => {}} />
                </List>
            </Div>
        </PanelTemplate>
    );
};
