import { FC, useContext } from "react";
import {
    Footer,
    Group,
    Header,
    Panel,
    PanelHeaderBack,
    PanelSpinner,
    SimpleCell,
    Spinner,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { useQuery } from "react-query";
import { shtabStore } from "../store/shtabStore";
import { ShtabsAPI } from "../../utils/requests/shtab-request";
import { PanelProps } from "../../types";

export const ListPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { goBack, setPage } = useContext(routerStore);
    const { setShtabId } = useContext(shtabStore);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["shtab-list"],
        queryFn: () => ShtabsAPI.getShtabs({}),
        retry: 1,
        refetchOnWindowFocus: false,
    });

    const handleSelect = (id: number) => {
        setShtabId(id);
        setPage(viewId, "base");
    };

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Штабы
                </Title>
            </PanelHeader>
            <Group>
                {isLoading && <PanelSpinner />}
                {!isLoading && data && data.count === 0 && (
                    <Footer>Ничего не найдено</Footer>
                )}
                {isError && <Footer>Произошла ошибка</Footer>}

                <Group header={<Header mode="secondary">Штабы</Header>}>
                    {data ? (
                        data.items.map((shtab) => (
                            <SimpleCell
                                key={shtab.id}
                                expandable={true}
                                onClick={() => handleSelect(shtab.id)}
                            >
                                {shtab.title}
                            </SimpleCell>
                        ))
                    ) : (
                        <Spinner size="small" style={{ margin: "20px 0" }} />
                    )}
                </Group>
            </Group>
        </Panel>
    );
});
