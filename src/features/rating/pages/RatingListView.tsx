import { FC, useContext } from "react";
import {
    PanelHeader,
    Group,
    PanelHeaderBack,
    Panel,
    CellButton,
} from "@vkontakte/vkui";
import Icon28AddOutline from "@vkontakte/icons/dist/28/add_outline";
import Icon28ChevronRightOutline from "@vkontakte/icons/dist/28/chevron_right_outline";
import { routerStore } from "../../stores/router-store";

export const RatingListView: FC<{ id: string }> = ({ id }) => {
    const { goBack, setPage } = useContext(routerStore);
    const changeView = (panel: string) => {
        setPage("else_rating", panel);
    };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                Все расчеты рейтинга
            </PanelHeader>
            <Group>
                <CellButton
                    before={<Icon28AddOutline />}
                    onClick={() => changeView("rating_view")}
                    after={<Icon28ChevronRightOutline />}
                >
                    Выполнить расчет
                </CellButton>
            </Group>
            <Group></Group>
        </Panel>
    );
};
