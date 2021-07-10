import { FC, useContext } from "react";
import {
    CellButton,
    Group,
    Header,
    InfoRow,
    Panel,
    PanelHeaderBack,
    PanelSpinner,
    ScreenSpinner,
    SimpleCell,
    Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { brigadeStore } from "../store/brigadeStore";
import { Icon28UsersOutline } from "@vkontakte/icons";
import { useQuery } from "react-query";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { PanelProps } from "../../types";
import { BrigadeLeaders } from "../ui/molecules/BrigadeLeaders";
import { boecStore } from "../../boec/store/boecStore";

export const ViewPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { goBack, setPage, openPopout, closePopout } =
        useContext(routerStore);
    const { brigadeId } = useContext(brigadeStore);
    const { setBoecId } = useContext(boecStore);

    const handleOpenList = () => {
        setPage(viewId, "details_boecs_list");
    };

    const handleBrigadeEdit = () => {
        setPage(viewId, "edit");
    };

    const { data: brigade, isLoading } = useQuery({
        queryKey: ["brigade", brigadeId],
        queryFn: ({ queryKey }) => {
            openPopout(<ScreenSpinner />);
            return BrigadesAPI.getBrigade(queryKey[1] as number);
        },
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!brigadeId,
        onSuccess: closePopout,
    });

    const handleAddBoec = () => {
        setBoecId(null);
        setPage("boec", "edit");
    };

    return (
        <Panel id={id}>
            {!isLoading ? (
                <>
                    <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                        <Title level="2" weight="bold">
                            {brigade?.title}
                        </Title>
                    </PanelHeader>
                    <Group
                        header={
                            <Header mode="secondary">
                                Информация об отряде
                            </Header>
                        }
                    >
                        <SimpleCell multiline>
                            <InfoRow header="День рождения">
                                {brigade?.DOB
                                    ? new Date(brigade.DOB).toLocaleDateString()
                                    : "Не указан"}
                            </InfoRow>
                        </SimpleCell>
                        <SimpleCell>
                            <InfoRow header="Штаб">
                                {brigade?.shtab.title}
                            </InfoRow>
                        </SimpleCell>
                        <SimpleCell>
                            <InfoRow header="Численность">
                                {brigade?.boec_count}
                            </InfoRow>
                        </SimpleCell>
                    </Group>
                    <Group
                        header={
                            <Header mode="secondary">Командый состав</Header>
                        }
                    >
                        <BrigadeLeaders brigadeId={brigadeId!} />
                    </Group>
                    <Group>
                        <SimpleCell
                            before={<Icon28UsersOutline />}
                            expandable={true}
                            onClick={handleOpenList}
                        >
                            Cписок бойцов
                        </SimpleCell>
                        <CellButton
                            expandable={true}
                            onClick={handleBrigadeEdit}
                        >
                            Редактировать
                        </CellButton>
                        <CellButton onClick={handleAddBoec}>
                            Добавить бойца
                        </CellButton>
                    </Group>
                </>
            ) : (
                <PanelSpinner />
            )}
        </Panel>
    );
});
