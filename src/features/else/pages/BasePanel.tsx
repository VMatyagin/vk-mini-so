import { Icon28SearchOutline } from "@vkontakte/icons";
import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    CellButton,
    SimpleCell,
    Header,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { eventStore } from "../../event/store/eventStore";
import { routerStore } from "../../stores/router-store";
import { PanelProps } from "../../types";

export const BasePanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { goBack, setPage } = useContext(routerStore);
    const { setEventId } = useContext(eventStore);
    const changeView = (panel: string) => {
        setPage(viewId, panel);
    };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                Управление мероприятиями
            </PanelHeader>
            <Group
                header={
                    <Header mode="secondary">Работа с существующими</Header>
                }
            >
                <SimpleCell
                    before={<Icon28SearchOutline />}
                    onClick={() => changeView("list")}
                >
                    Найти существующее
                </SimpleCell>
            </Group>
            <Group>
                <CellButton
                    expandable={true}
                    onClick={() => {
                        changeView("edit");
                        setEventId(null);
                    }}
                >
                    Создать новое
                </CellButton>
            </Group>
        </Panel>
    );
});
