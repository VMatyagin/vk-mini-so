import { FC, useContext, useMemo, useState } from "react";
import {
    Alert,
    Avatar,
    CellButton,
    Div,
    Footer,
    Group,
    Header,
    Panel,
    PanelHeaderBack,
    SimpleCell,
    Snackbar,
    Spinner,
    Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { Icon16WarningTriangle, Icon28PlaneOutline } from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { boecStore } from "../../boec/store/boecStore";
import { Boec, PanelProps } from "../../types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UsersAPI } from "../../utils/requests/user-request";
import { selectVKUsers } from "../../VKBridge";
import { UserPositions } from "../ui/molecules/UserPositions";
import { appStore } from "../../stores/app-store";

export const ViewPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { goBack, setPage, openPopout, closePopout } =
        useContext(routerStore);
    const { user } = useContext(appStore);
    const { seasons, boecId, setBoecId } = useContext(boecStore);
    const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);
    const queryClient = useQueryClient();

    const {
        data: boec,
        isLoading,
        isError,
    } = useQuery<Boec>({
        queryKey: ["boec", boecId!],
        queryFn: ({ queryKey }) => {
            return UsersAPI.getUserData(queryKey[1] as string);
        },
        retry: 1,
        refetchOnWindowFocus: false,
    });

    const handleEdit = () => {
        setPage(viewId, "edit");
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
                    ?????????????????? ???????????? (m.vk.com) ???? ????????????????????????????
                </Snackbar>
            );
        }
    };
    const mutation = useMutation<Boec, Error, void, Boec>(
        () => UsersAPI.removeUser(boecId!),
        {
            onSuccess: () => {
                closePopout();
                goBack();
                setBoecId(null);
                queryClient.refetchQueries();
            },
        }
    );
    const handleDelete = () => {
        openPopout(
            <Alert
                actions={[
                    {
                        title: "??????????????",
                        mode: "destructive",
                        autoclose: true,
                        action: mutation.mutate,
                    },
                    {
                        title: "????????????",
                        autoclose: true,
                        mode: "cancel",
                    },
                ]}
                actionsLayout="vertical"
                onClose={closePopout}
                header="?????????????????????? ????????????????"
                text="???? ??????????????, ?????? ???????????? ?????????????? ???????????"
            />
        );
    };

    const userCanAttach = useMemo(() => {
        // ?????????????????? ???? ?????????????????????? ?????????????? ?????????? ?? ?????????????????? ??????????????
        // ?????? ???????????????????????????? ????????????????????????
        return (
            (seasons || [])
                .map((item) => item.brigadeId)
                .filter((id) =>
                    user!.brigades.map((brigade) => brigade.id).includes(id)
                ).length > 0
        );
    }, [seasons, user]);
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    ????????
                </Title>
            </PanelHeader>
            {isLoading || isError ? (
                <Spinner size="small" style={{ margin: "20px 0" }} />
            ) : (
                <>
                    <Group>
                        <Div>
                            <Title level="2" weight="medium">
                                {boec!.fullName}
                            </Title>
                        </Div>
                    </Group>
                    <Group
                        header={<Header mode="secondary">???????? ????????????</Header>}
                    >
                        {seasons === null && (
                            <Spinner
                                size="small"
                                style={{ margin: "20px 0" }}
                            />
                        )}
                        {seasons && seasons.length === 0 && (
                            <Footer>???????????? ???? ??????????????</Footer>
                        )}
                        {seasons &&
                            seasons.map((season) => (
                                <SimpleCell
                                    key={`${season.id}-${season.brigade.id}`}
                                    indicator={season.year}
                                    before={<Icon28PlaneOutline />}
                                >
                                    {season.brigade.title}{season.isCandidate && <i> | ????????????????</i>}
                                </SimpleCell>
                            ))}
                    </Group>
                    <Group header={<Header mode="secondary">??????????????????</Header>}>
                        <UserPositions />
                    </Group>
                    {seasons && (
                        <Group>
                            <CellButton expandable={true} onClick={handleEdit}>
                                ??????????????????????????
                            </CellButton>
                            {userCanAttach && (
                                <CellButton
                                    expandable={true}
                                    onClick={handleSelectUser}
                                >
                                    ?????????????????? ?? ???????????????? ????
                                </CellButton>
                            )}
                            {user!.is_staff && (
                                <CellButton
                                    expandable={true}
                                    mode="danger"
                                    onClick={handleDelete}
                                >
                                    ??????????????
                                </CellButton>
                            )}
                        </Group>
                    )}
                </>
            )}
            {SnackBar}
        </Panel>
    );
});
