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
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import React, { FC } from "react";

import { useMst } from "../../../stores";

export const UserEditSeasons: FC = observer(() => {
    const { boec, router } = useMst();

    const onCellClick = (id?: number) => {
        id && boec.selectSeason(id);
        router.setPage("user", "season");
    };

    return boec.boecData ? (
        <Group header={<Header>Года выезда</Header>}>
            {boec.boecData.seasons
                .slice()
                .sort((a, b) => a.year - b.year)
                .map((season) => (
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
    ) : null;
});
