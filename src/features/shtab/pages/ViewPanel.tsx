import { FC, useContext } from "react";
import {
    CellButton,
    Div,
    Footer,
    Group,
    Header,
    Panel,
    PanelHeaderBack,
    PanelSpinner,
    SimpleCell,
    Spinner,
    Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { PanelProps, Shtab } from "../../types";
import { shtabStore } from "../store/shtabStore";
import { useQuery } from "react-query";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { brigadeStore } from "../../brigades/store/brigadeStore";
import { ShtabsAPI } from "../../utils/requests/shtab-request";
import { ShtabLeaders } from "../../boec/ui/molecules/ShtabLeaders";

export const ViewPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { goBack, setPage } = useContext(routerStore);
    const { shtabId } = useContext(shtabStore);
    const { setBrigadeId } = useContext(brigadeStore);

    const selectBrigade = (id: number) => {
        setBrigadeId(id);
        setPage("brigades", "details");
    };
    const openEdit = () => {
        setPage(viewId, "edit");
    };
    const { data: shtabInfo } = useQuery<Shtab>({
        queryKey: ["shtab", shtabId!],
        queryFn: ({ queryKey }) => {
            return ShtabsAPI.getShtab(queryKey[1] as number);
        },
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: shtabId !== null,
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: [id],
        queryFn: () =>
            BrigadesAPI.getAreas({
                shtab: shtabId!,
            }),
        retry: 1,
        refetchOnWindowFocus: false,
    });

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Штаб
                </Title>
            </PanelHeader>

            {!data || !shtabInfo ? (
                <Spinner size="small" style={{ margin: "20px 0" }} />
            ) : (
                <>
                    <Group>
                        <Div>
                            <Title level="2" weight="medium">
                                {shtabInfo.title}
                            </Title>
                        </Div>
                    </Group>
                    <Group
                        header={
                            <Header mode="secondary">Командый состав</Header>
                        }
                    >
                        <ShtabLeaders />
                    </Group>
                    {isLoading && <PanelSpinner />}
                    {!isLoading && data && data.count === 0 && (
                        <Footer>Ничего не найдено</Footer>
                    )}
                    {isError && <Footer>Произошла ошибка</Footer>}
                    {data &&
                        data.items
                            .filter((area) => area.brigades.length > 0)
                            .sort(
                                (a, b) => b.brigades.length - a.brigades.length
                            )
                            .map((area) => (
                                <Group
                                    key={area.id}
                                    header={
                                        <Header mode="secondary">
                                            {area.title}
                                        </Header>
                                    }
                                >
                                    {area.brigades.map((brigade) => (
                                        <SimpleCell
                                            key={brigade.id}
                                            onClick={() =>
                                                selectBrigade(brigade.id)
                                            }
                                        >
                                            {brigade.title}
                                        </SimpleCell>
                                    ))}
                                </Group>
                            ))}
                    <Group>
                        <CellButton onClick={openEdit}>
                            Редактировать
                        </CellButton>
                    </Group>
                </>
            )}
        </Panel>
    );
});
