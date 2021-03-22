import { FC } from "react";
import {
    PanelHeader,
    Group,
    PanelHeaderBack,
    Panel,
    CellButton,
} from "@vkontakte/vkui";
import { useMst } from "../../stores";
import Icon28AddOutline from "@vkontakte/icons/dist/28/add_outline";
import Icon28ChevronRightOutline from "@vkontakte/icons/dist/28/chevron_right_outline";

export const RatingListView: FC<{ id: string }> = ({ id }) => {
    const store = useMst();
    const changeView = (panel: string) => {
        store.router.setPage("else_rating", panel);
    };
    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={store.router.goBack} />}
            >
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
            <Group>
            </Group>
        </Panel>
    );
};
