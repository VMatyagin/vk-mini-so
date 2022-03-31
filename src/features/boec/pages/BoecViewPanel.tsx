import { FC, useContext, useMemo, useState } from "react";
import {
    Alert,
    CellButton,
    Div,
    Footer,
    Group,
    Header,
    Panel,
    PanelHeaderBack,
    PanelSpinner,
    Spinner,
    Title,
    PanelProps,
    SimpleCell,
    Avatar,
    Snackbar,
    Link
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { Boec, Season } from "../../types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UsersAPI } from "../../utils/requests/user-request";
import { UserPositions } from "../ui/molecules/UserPositions";
import { appStore } from "../../stores/app-store";
import { useRoute } from "react-router5";
import { Icon16WarningTriangle, Icon28PlaneOutline } from "@vkontakte/icons";
import { selectVKUsers } from "../../VKBridge";

export const BoecViewPanel: FC<PanelProps> = observer(props => {
    const { openPopout, closePopout } = useContext(routerStore);

    const { user } = useContext(appStore);
    const {
        route,
        router: { navigate }
    } = useRoute();
    const { boecId } = useMemo(() => route.params, [route]);
    const isMe = useMemo(
        () => user?.boec?.id === boecId,
        [boecId, user?.boec?.id]
    );
    const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);

    const queryClient = useQueryClient();
    const { data: seasons } = useQuery<Season[]>({
        queryKey: ["seasons-boec", boecId],
        queryFn: ({ queryKey }) =>
            UsersAPI.getUserSeasons(queryKey[1] as number, "accepted"),
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!boecId
    });
    const {
        data: boec,
        isLoading,
        isError,
        refetch
    } = useQuery<Boec>({
        queryKey: ["boec", boecId],
        queryFn: ({ queryKey }) => {
            return UsersAPI.getUserData(queryKey[1] as string);
        },
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!boecId
    });

    const handleEdit = () => {
        navigate("else.boec.edit", { boecId });
    };
    const handleHistory = () => {
        navigate("else.boec.history", { boecId });
    };

    const handleSelectUser = async () => {
        const user = await selectVKUsers();
        // not working in mobile web
        console.log(user[0]);
        if (!user[0]) {
            setSnackBar(
                <Snackbar
                    onClose={() => setSnackBar(null)}
                    before={
                        <Avatar
                            size={24}
                            style={{ background: "var(--dynamic_red)" }}
                        >
                            <Icon16WarningTriangle
                                fill="#fff"
                                width={14}
                                height={14}
                            />
                        </Avatar>
                    }
                >
                    Мобильная версия (m.vk.com) не поддерживается
                </Snackbar>
            );
        } else {
            UsersAPI.updateBoecData({ id: boec?.id, vkId: user[0].id }).then(
                () => {
                    refetch();
                }
            );
        }
    };
    const mutation = useMutation<Boec, Error, void, Boec>(
        () => UsersAPI.removeUser(boecId),
        {
            onSuccess: () => {
                closePopout();
                window.history.back();
                queryClient.refetchQueries();
            }
        }
    );
    const handleDelete = () => {
        openPopout(
            <Alert
                actions={[
                    {
                        title: "Удалить",
                        mode: "destructive",
                        autoclose: true,
                        action: mutation.mutate
                    },
                    {
                        title: "Отмена",
                        autoclose: true,
                        mode: "cancel"
                    }
                ]}
                actionsLayout="vertical"
                onClose={closePopout}
                header="Подтвердите действие"
                text="Вы уверены, что хотите удалить бойца?"
            />
        );
    };

    // const userCanAttach = useMemo(() => {
    //   // проверяем на пересечение сезонов бойца и доступных отрядов
    //   // для редактированию пользователя
    //   return (
    //     (seasons || [])
    //       .map((item) => item.brigadeId)
    //       .filter((id) =>
    //         user!.brigades.map((brigade) => brigade.id).includes(id)
    //       ).length > 0 || user?.isStaff
    //   );
    // }, [seasons, user]);
    return (
        <Panel {...props}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => window.history.back()} />}
            >
                <Title level="2" weight="bold">
                    Боец
                </Title>
            </PanelHeader>
            {isLoading || isError || !boec ? (
                <Group>
                    <PanelSpinner size="small" style={{ margin: "20px 0" }} />
                </Group>
            ) : (
                <>
                    <Group>
                        <Div>
                            <Title level="2" weight="1">
                                {boec!.fullName}
                            </Title>
                        </Div>
                    </Group>
                    <Group
                        header={<Header mode="secondary">Года выезда</Header>}
                    >
                        {seasons === null && (
                            <Spinner
                                size="small"
                                style={{ margin: "20px 0" }}
                            />
                        )}
                        {seasons?.length === 0 && (
                            <Footer>Ничего не найдено</Footer>
                        )}
                        {seasons?.map(season => (
                            <SimpleCell
                                key={season.id}
                                indicator={season?.reports?.[0].year}
                                before={<Icon28PlaneOutline />}
                                disabled
                            >
                                {season?.reports?.[0]?.brigade.fullTitle}
                            </SimpleCell>
                        ))}
                    </Group>
                    <Group header={<Header mode="secondary">Должности</Header>}>
                        <UserPositions />
                    </Group>
                    <Group>
                        {boec.vkId && (
                            <Div>
                                <Link
                                    href={`https://vk.com/id${boec.vkId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    На страницу ВК
                                </Link>
                            </Div>
                        )}
                        <CellButton expandable={true} onClick={handleHistory}>
                            {isMe
                                ? "Где я участвовал"
                                : "Участия в мероприятиях"}
                        </CellButton>
                        {isMe && (
                            <CellButton expandable={true} onClick={handleEdit}>
                                Редактировать
                            </CellButton>
                        )}
                        {boec.canEdit && boec.vkId === null && (
                            <CellButton
                                expandable={true}
                                onClick={handleSelectUser}
                            >
                                Привязать к странице ВК
                            </CellButton>
                        )}
                        {user!.isStaff && (
                            <CellButton
                                expandable={true}
                                mode="danger"
                                onClick={handleDelete}
                            >
                                Удалить
                            </CellButton>
                        )}
                    </Group>
                </>
            )}
            {SnackBar}
        </Panel>
    );
});
