import { Icon28AddOutline, Icon28PlaneOutline } from "@vkontakte/icons";
import {
    CellButton,
    Group,
    Header,
    SimpleCell,
    Spinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext, useMemo } from "react";
import { useQuery } from "react-query";
import { boecStore } from "../../../../boec/store/boecStore";
import { appStore } from "../../../../stores/app-store";

import { routerStore } from "../../../../stores/router-store";
import { Seasons } from "../../../../types";
import { UsersAPI } from "../../../../utils/requests/user-request";

export const UserEditSeasons: FC<{ viewId: string }> = observer(
    ({ viewId }) => {
        const { setPage } = useContext(routerStore);
        const { boecId } = useContext(boecStore);
        const { user } = useContext(appStore);

        const { data: seasons } = useQuery<Seasons[]>({
            queryKey: ["seasons", boecId],
            queryFn: ({ queryKey }) =>
                UsersAPI.getUserSeasons(queryKey[1] as number),
            retry: 1,
            refetchOnWindowFocus: false,
            enabled: !!boecId,
        });
        const onCellClick = () => {
            setPage(viewId, "season");
        };

        const canAdd = useMemo(() => {
            // может редачить либо сам, либо стафф
            return boecId === user!.boec.id || user!.isStaff;
        }, [boecId, user]);

        if (!boecId) {
            return null;
        }

        return (
            <Group header={<Header>Года выезда</Header>}>
                {!seasons && (
                    <Spinner size="small" style={{ margin: "20px 0" }} />
                )}

                {seasons &&
                    seasons.map((season) => (
                        <SimpleCell
                            key={season.id}
                            description={`${season.year} | ${
                                season.isCandidate ? "Кандидат" : "Боец"
                            }`}
                            before={<Icon28PlaneOutline />}
                        >
                            {season.brigade.title}
                            {!season.isAccepted && <i> - не подтвержденный</i>}
                        </SimpleCell>
                    ))}
                {canAdd && (
                    <CellButton
                        before={<Icon28AddOutline />}
                        onClick={() => onCellClick()}
                    >
                        Добавить сезон
                    </CellButton>
                )}
            </Group>
        );
    }
);
