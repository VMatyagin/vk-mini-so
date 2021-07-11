import {
    Icon28DeleteOutline,
    Icon28DeleteOutlineAndroid,
} from "@vkontakte/icons";
import {
    ActionSheet,
    ActionSheetItem,
    Footer,
    IOS,
    ScreenSpinner,
    SimpleCell,
    Spinner,
    usePlatform,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { boecStore } from "../../../../boec/store/boecStore";
import { MODAL_BOEC_POSITION_SELECT } from "../../../../boec/ui/modals/LeaderPositionModal";
import { positions } from "../../../../brigades/helpers";
import { shtabStore } from "../../../../shtab/store/shtabStore";
import { routerStore } from "../../../../stores/router-store";
import { Position } from "../../../../types";
import { BrigadesAPI } from "../../../../utils/requests/brigades-request";
import { ShtabsAPI } from "../../../../utils/requests/shtab-request";

interface ShtabLeadersProps {
    isEditing?: boolean;
}
export const ShtabLeaders: FC<ShtabLeadersProps> = observer(({ isEditing }) => {
    const { openPopout, closePopout, setPage, setModalCallback, openModal } =
        useContext(routerStore);
    const { shtabId } = useContext(shtabStore);
    const { setPosition } = useContext(boecStore);
    const { setBoecId } = useContext(boecStore);

    const {
        data: shtabPositions,
        isLoading: isPositionsLoading,
        refetch,
    } = useQuery({
        queryKey: ["shtab-positions", shtabId],
        queryFn: ({ queryKey }) => {
            return ShtabsAPI.getShtabPositions({
                shtabId: queryKey[1] as number,
                hideLast: isEditing ? false : true,
            });
        },
        retry: 1,
        enabled: !!shtabId,
        refetchOnWindowFocus: false,
    });
    const { mutate: updatePosition } = useMutation<Position, Error, Position>(
        (data) => {
            openPopout(<ScreenSpinner />);
            return BrigadesAPI.updateBrigadePosition(data);
        },
        {
            onSuccess: () => {
                closePopout();
                refetch();
            },
        }
    );
    const { mutate: deleteMutation } = useMutation<Position, Error, Position>(
        (data) => {
            openPopout(<ScreenSpinner />);
            return BrigadesAPI.removeBrigadePosition({
                brigadeId: data.brigade.id,
                positionId: data.id,
            });
        },
        {
            onSuccess: () => {
                closePopout();
                refetch();
            },
        }
    );

    const openEditModal = (item: Position) => {
        setPosition(item);
        setModalCallback(MODAL_BOEC_POSITION_SELECT, (updatedPosition) => {
            updatePosition(updatedPosition);
        });
        openModal(MODAL_BOEC_POSITION_SELECT);
    };
    const platform = usePlatform();
    const handleOpenActionSheet = (item: Position) => {
        openPopout(
            <ActionSheet
                onClose={closePopout}
                iosCloseItem={
                    <ActionSheetItem autoclose mode="cancel">
                        Отменить
                    </ActionSheetItem>
                }
            >
                <ActionSheetItem onClick={() => openEditModal(item)} autoclose>
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
                    onClick={() => deleteMutation(item)}
                >
                    Удалить
                </ActionSheetItem>
            </ActionSheet>
        );
    };
    const changeView = (id: number) => {
        setBoecId(id);
        setPage("boec", "base");
    };
    return (
        <>
            {isPositionsLoading && (
                <Spinner size="small" style={{ margin: "20px 0" }} />
            )}
            {shtabPositions &&
                (shtabPositions.length === 0 ? (
                    <Footer>Ничего не найдено</Footer>
                ) : (
                    shtabPositions.map((item) => (
                        <SimpleCell
                            // description={positions[item.position].title}
                            description={`${new Date(
                                item.fromDate!
                            ).toLocaleString("ru", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                            })} - ${
                                item.toDate
                                    ? new Date(item.toDate!).toLocaleString(
                                          "ru",
                                          {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "2-digit",
                                          }
                                      )
                                    : "настоящее время"
                            }`}
                            onClick={() =>
                                isEditing
                                    ? handleOpenActionSheet(item)
                                    : changeView(item.boec.id)
                            }
                        >
                            {`${item.boec.fullName} | ${
                                positions[item.position].title
                            }`}
                        </SimpleCell>
                    ))
                ))}
        </>
    );
});
