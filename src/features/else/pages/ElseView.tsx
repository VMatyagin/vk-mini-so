import {
    Icon28CalendarOutline,
    Icon28UsersOutline,
    // Icon28StatisticsOutline,
    Icon28UserSquareOutline,
    // Icon28HelpOutline,
    // Icon28MailOutline,
    // Icon28PollSquareOutline,
    // Icon28ScanViewfinderOutline,
    // Icon28StatisticsOutline,
    // Icon28UsersOutline,
} from "@vkontakte/icons";
import { Group, Panel, PanelHeader, SimpleCell, Switch } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext, useState } from "react";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { brigadeStore } from "../../brigades/store/brigadeStore";
import { shtabStore } from "../../shtab/store/shtabStore";
import { appStore } from "../../stores/app-store";
import { routerStore } from "../../stores/router-store";
import { SubjectSelectingCell } from "../ui/molecules/SubjectSelectingCell";

export const ElseView: FC<{ id: string }> = observer(({ id }) => {
    const { setPage } = useContext(routerStore);
    const { user } = useContext(appStore);
    const { setBrigadeId } = useContext(brigadeStore);
    const { setShtabId } = useContext(shtabStore);

    const [checked, setChecked] = useState(false);
    const handleClick = () => setChecked(!checked);
    const changeView = (view: string) => {
        setPage(view, "base");
    };
    const openEvents = () => {
        setPage("event", "list");
    };

    const selectBrigade = (id: number) => {
        setBrigadeId(id);
        setPage("brigades", "details");
    };
    const selectShtab = (id: number) => {
        setShtabId(id);
        setPage("shtab", "base");
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
                    {/* TODO add spinner if !user */}
                    {user !== null && user.shtabs.length > 0 && (
                        <>
                            <SimpleCell
                                before={<Icon28CalendarOutline />}
                                onClick={() => changeView("event")}
                            >
                                Управление мероприятиями
                            </SimpleCell>
                            <SimpleCell
                                before={<Icon28UserSquareOutline />}
                                onClick={() => changeView("brigades")}
                            >
                                Отряды
                            </SimpleCell>
                            <SimpleCell
                                before={<Icon28UserSquareOutline />}
                                onClick={() => setPage("boec", "list")}
                            >
                                Поиск по бойцам
                            </SimpleCell>
                        </>
                    )}
                    {user &&
                        (user.brigades.length !== 0 ||
                            user.shtabs.length !== 0) && (
                            <SubjectSelectingCell
                                onBrigadeClick={selectBrigade}
                                onShtabClick={selectShtab}
                            >
                                {({ handleClick, ref }) => (
                                    <SimpleCell
                                        getRootRef={ref}
                                        onClick={handleClick}
                                        before={<Icon28UsersOutline />}
                                    >
                                        Мой коллектив
                                    </SimpleCell>
                                )}
                            </SubjectSelectingCell>
                        )}
                    {user && user.is_staff && (
                        <SimpleCell
                            before={<Icon28UserSquareOutline />}
                            onClick={() => setPage("shtab", "list")}
                        >
                            Штабы
                        </SimpleCell>
                    )}

                    <SimpleCell
                        before={<Icon28CalendarOutline />}
                        onClick={openEvents}
                    >
                        Мероприятия
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
