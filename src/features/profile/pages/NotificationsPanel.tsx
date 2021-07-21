import { FC, ReactNode, useContext, useEffect } from "react";
import {
    Group,
    Header,
    Panel,
    PanelHeaderBack,
    SimpleCell,
    Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import {
    Icon28ErrorCircleOutline,
    Icon28Favorite,
    Icon28WarningTriangleOutline,
} from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { Activity, PanelProps } from "../../types";
import { useQuery } from "react-query";
import { UsersAPI } from "../../utils/requests/user-request";
import { LazyList } from "../../../ui/organisms/LazyList";

const getTitle = (item: Activity) => {
    if (item.type === 0) {
        return item.warning!.text;
    }
    if (item.type === 1) {
        return item.warning!.text;
    }
    if (item.type === 2) {
        return `Вы заработали достижение "${item.achievement?.title}"`;
    }
};
const getBefore = (item: Activity): ReactNode => {
    if (item.type === 0) {
        return <Icon28ErrorCircleOutline />;
    }
    if (item.type === 1) {
        return <Icon28WarningTriangleOutline />;
    }
    if (item.type === 2) {
        return <Icon28Favorite />;
    }
};

export const NotificationsPanel: FC<PanelProps> = observer(({ id }) => {
    const { goBack } = useContext(routerStore);
    const { data } = useQuery({
        queryKey: ["user-activity"],
        queryFn: () => UsersAPI.getActivities({}),
        retry: 1,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (data && data.items.length > 0) {
            UsersAPI.ActivietisMarkAsRead();
        }
    }, [data]);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Уведомления
                </Title>
            </PanelHeader>
            {data && data.items.length > 0 && (
                <Group header={<Header mode="secondary">Новые</Header>}>
                    {data.items.map((item) => (
                        <SimpleCell
                            before={getBefore(item)}
                            description={new Date(
                                item.created_at
                            ).toLocaleString("ru", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        >
                            {getTitle(item)}
                        </SimpleCell>
                    ))}
                </Group>
            )}
            <LazyList
                title={"Просмотрено"}
                fetchFn={UsersAPI.getActivities}
                queryKey={`user-activity-past`}
                extraFnProp={{
                    seen: true,
                }}
                renderItem={(item: Activity) => (
                    <SimpleCell
                        before={getBefore(item)}
                        description={new Date(item.created_at).toLocaleString(
                            "ru",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }
                        )}
                    >
                        {getTitle(item)}
                    </SimpleCell>
                )}
            />
        </Panel>
    );
});
