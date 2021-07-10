import {
    Icon28AddOutline,
    Icon28EditOutline,
    Icon28PlaneOutline,
} from "@vkontakte/icons";
import {
    CellButton,
    Group,
    Header,
    IconButton,
    SimpleCell,
    Spinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { boecStore } from "../../../../boec/store/boecStore";

import { routerStore } from "../../../../stores/router-store";

export const UserEditSeasons: FC<{ viewId: string }> = observer(
    ({ viewId }) => {
        const { setPage } = useContext(routerStore);
        const { selectSeason, seasons, boecId } = useContext(boecStore);

        const onCellClick = (id?: number) => {
            id && selectSeason(id);
            setPage(viewId, "season");
        };

        if (!boecId) {
            return null;
        }

        return (
            <Group header={<Header>Года выезда</Header>}>
                {!seasons && (
                    <Spinner size="small" style={{ margin: "20px 0" }} />
                )}

                {seasons !== null &&
                    seasons.map((season) => (
                        <SimpleCell
                            key={season.id}
                            description={season.year}
                            before={<Icon28PlaneOutline />}
                            onClick={() => onCellClick(season.id)}
                            after={
                                <IconButton>
                                    <Icon28EditOutline />
                                </IconButton>
                            }
                        >
                            {season.brigade.title}
                        </SimpleCell>
                    ))}
                <CellButton
                    before={<Icon28AddOutline />}
                    onClick={() => onCellClick()}
                >
                    Добавить сезон
                </CellButton>
            </Group>
        );
    }
);
