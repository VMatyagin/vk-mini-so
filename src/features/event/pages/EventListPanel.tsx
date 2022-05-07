import { FC, useContext, useMemo, useState } from "react";
import {
    Panel,
    PanelHeaderBack,
    SimpleCell,
    PanelProps,
    ScreenSpinner,
    Tabs,
    TabsItem
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { LazyList } from "../../../ui/organisms/LazyList";
import { EventType } from "../../types";
import { EventAPI } from "../../utils/requests/event-request";
import { useRoute, useRouter } from "react-router5";
import { useQuery } from "react-query";
import { routerStore } from "../../stores/router-store";
import { getDateString } from "../../utils/getDateString";
import { onHistoryBack } from "../../utils/onHistoryBack";

const getDescription = ({
    date,
    place,
    time
}: {
    date?: string | null;
    time?: string | null;
    place?: string | null;
}) => {
    let description = "";
    if (date) {
        description += getDateString(date, time);
    }

    if (place) {
        description += `| ${place}`;
    }

    return description;
};

export const EventListPanel: FC<PanelProps> = observer(props => {
    const { navigate } = useRouter();
    const { previousRoute, route } = useRoute();

    const { shtabId } = useMemo(() => route.params, [route]);

    const { openPopout, closePopout } = useContext(routerStore);
    const [selectedId, selectId] = useState<null | number>(null);
    const [tab, setTab] = useState(0);
    useQuery({
        queryKey: ["event", selectedId],
        queryFn: ({ queryKey }) => {
            openPopout(<ScreenSpinner />);
            return EventAPI.getEvent(queryKey[1] as number);
        },
        onSuccess: (data: EventType) => {
            closePopout();
            navigate("else.event.details", { eventId: data.id });
        },
        onError: closePopout,
        retry: false,
        enabled: !!selectedId,
        refetchOnWindowFocus: false
    });
    const changeView = (eventId: number) => {
        selectId(eventId);
    };
    return (
        <Panel {...props}>
            <PanelHeader
                left={
                    <PanelHeaderBack onClick={onHistoryBack(previousRoute)} />
                }
            >
                <Title level="2" weight="bold">
                    Мероприятия
                </Title>
            </PanelHeader>
            <LazyList
                before={
                    <Tabs>
                        <TabsItem
                            onClick={() => setTab(0)}
                            selected={tab === 0}
                        >
                            Актуальные
                        </TabsItem>
                        <TabsItem
                            onClick={() => setTab(1)}
                            selected={tab === 1}
                        >
                            Прошедшие
                        </TabsItem>
                    </Tabs>
                }
                withSearch={true}
                fetchFn={EventAPI.getEventList}
                queryKey={"event-list"}
                extraFnProp={{
                    passed: tab === 1 ? true : false,
                    visibility: !shtabId ? true : undefined,
                    shtabId
                }}
                pullToRefresh
                renderItem={(item: EventType) => (
                    <SimpleCell
                        key={item.id}
                        onClick={() => changeView(item.id)}
                        description={getDescription({
                            date: item.startDate,
                            place: item.location,
                            time: item.startTime
                        })}
                    >
                        {item.shtab?.title
                            ? `${item.title} | ${item.shtab?.title}`
                            : item.title}
                    </SimpleCell>
                )}
            />
        </Panel>
    );
});
