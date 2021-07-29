import { FC, useContext } from "react";
import {
    ActionSheet,
    ActionSheetItem,
    CellButton,
    Group,
    IOS,
    Panel,
    PanelHeaderBack,
    ScreenSpinner,
    SimpleCell,
    usePlatform,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { LazyList } from "../../../ui/organisms/LazyList";
import { Nomination, PanelProps } from "../../types";
import { eventStore } from "../store/eventStore";
import { EventAPI } from "../../utils/requests/event-request";
import {
    Icon28DeleteOutline,
    Icon28DeleteOutlineAndroid,
} from "@vkontakte/icons";
import { useMutation, useQueryClient } from "react-query";
import Icon28EditOutline from "@vkontakte/icons/dist/28/edit_outline";
import { MODAL_EVENT_NOMINATION_EDIT } from "../ui/modals/NominationEditModal";

export const NomiantionsListPanel: FC<PanelProps> = observer(({ id }) => {
    const { competitionId, setNominationId } = useContext(eventStore);
    const { goBack, openPopout, closePopout, openModal, setModalCallback } =
        useContext(routerStore);
    const queryClient = useQueryClient();
    const platform = usePlatform();

    const { mutate: removeNomination } = useMutation<
        Nomination,
        Error,
        {
            nominationId: number;
            competitionId: number;
        }
    >(
        ({ competitionId, nominationId }) => {
            closePopout();
            openPopout(<ScreenSpinner />);
            return EventAPI.removeCompetitionNomination({
                nominationId,
                competitionId,
            });
        },
        {
            onSuccess: () => {
                closePopout();
                queryClient.refetchQueries(`nominations-${competitionId}`);
            },
            onError: closePopout,
        }
    );

    const handleOpenActionSheet = (nomination: Nomination) => {
        openPopout(
            <ActionSheet
                onClose={closePopout}
                iosCloseItem={
                    <ActionSheetItem autoclose mode="cancel">
                        Отменить
                    </ActionSheetItem>
                }
            >
                <ActionSheetItem
                    onClick={() => openEditModal(nomination.id)}
                    autoclose
                    before={<Icon28EditOutline />}
                >
                    Редактировать
                </ActionSheetItem>

                <ActionSheetItem
                    autoclose
                    before={
                        platform === IOS ? (
                            <Icon28DeleteOutline />
                        ) : (
                            <Icon28DeleteOutlineAndroid />
                        )
                    }
                    mode="destructive"
                    onClick={() =>
                        removeNomination({
                            nominationId: nomination.id,
                            competitionId: competitionId!,
                        })
                    }
                >
                    Удалить
                </ActionSheetItem>
            </ActionSheet>
        );
    };
    const openEditModal = (id?: number) => {
        id ? setNominationId(id) : setNominationId(null);
        setModalCallback(MODAL_EVENT_NOMINATION_EDIT, () => {
            queryClient.refetchQueries(`nominations-${competitionId}`);
        });
        openModal(MODAL_EVENT_NOMINATION_EDIT);
    };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Номинации
                </Title>
            </PanelHeader>
            <Group>
                <LazyList
                    title="Номинации"
                    fetchFn={EventAPI.getCompetitionNominations}
                    queryKey={`nominations-${competitionId}`}
                    extraFnProp={{
                        competitionId: competitionId!,
                    }}
                    enabled={!!competitionId}
                    renderItem={(item) => (
                        <SimpleCell
                            onClick={() => handleOpenActionSheet(item)}
                            key={item.id}
                        >
                            {item.title}
                        </SimpleCell>
                    )}
                />
            </Group>
            <Group>
                <CellButton onClick={() => openEditModal()}>
                    Добавить номинацию
                </CellButton>
            </Group>
        </Panel>
    );
});
