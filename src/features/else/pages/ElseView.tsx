import {
    Icon28CalendarOutline,
    Icon28ChevronRightOutline,
    Icon28StatisticsOutline,
    // Icon28HelpOutline,
    // Icon28MailOutline,
    // Icon28PollSquareOutline,
    // Icon28ScanViewfinderOutline,
    // Icon28StatisticsOutline,
    // Icon28UsersOutline,
} from "@vkontakte/icons";
import { Group, Panel, PanelHeader, SimpleCell, Switch } from "@vkontakte/vkui";
import { observer } from "mobx-react";
import { FC, useState } from "react";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { useMst } from "../../stores";

export const ElseView: FC<{ id: string }> = observer(({ id }) => {
    const store = useMst();
    const [checked, setChecked] = useState(false);
    const handleClick = () => setChecked(!checked);
    const changeView = (view: string) => {
        store.router.setPage(view, "base");
    };
    return (
        <AbstractView id={id}>
            <Panel id="base">
                <PanelHeader>Ещё</PanelHeader>
                <Group description="Уведомления о предстоящих мероприятиях и всем, что связано с ними">
                    <SimpleCell
                        after={
                            <Switch onChange={handleClick} checked={checked} />
                        }
                    >
                        Уведомления
                    </SimpleCell>
                </Group>
                <Group>
                    <SimpleCell
                        before={<Icon28CalendarOutline />}
                        after={
                            <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                        }
                        onClick={() => changeView("else_event_handle")}
                    >
                        Управление мероприятиями
                    </SimpleCell>
                    <SimpleCell
                        before={<Icon28StatisticsOutline />}
                        after={
                            <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                        }
                        onClick={() => changeView("else_rating")}
                    >
                        Рейтинг
                    </SimpleCell>
                    {/* <SimpleCell
                        before={<Icon28ScanViewfinderOutline />}
                        after={
                            <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                        }
                    >
                        Контроль билетов
                    </SimpleCell>
                    <SimpleCell
                        before={<Icon28UsersOutline />}
                        after={
                            <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                        }
                    >
                        Мой отряд / штаб
                    </SimpleCell>
                
                    <SimpleCell
                        before={<Icon28MailOutline />}
                        after={
                            <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                        }
                    >
                        Приглашения
                    </SimpleCell>
                    <SimpleCell
                        before={<Icon28PollSquareOutline />}
                        after={
                            <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                        }
                    >
                        Голосования
                    </SimpleCell>
                    <SimpleCell
                        before={<Icon28HelpOutline />}
                        after={
                            <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                        }
                    >
                        Помощь
                    </SimpleCell> */}
                </Group>
            </Panel>
        </AbstractView>
    );
});
