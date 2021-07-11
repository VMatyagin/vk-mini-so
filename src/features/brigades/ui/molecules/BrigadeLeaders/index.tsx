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
import { routerStore } from "../../../../stores/router-store";
import { Position } from "../../../../types";
import { BrigadesAPI } from "../../../../utils/requests/brigades-request";
import { positions } from "../../../helpers";

interface BrigadeLeadersProps {
    brigadeId: number;
    isEditing?: boolean;
}
export const BrigadeLeaders: FC<BrigadeLeadersProps> = observer(
    ({ brigadeId, isEditing }) => {
        const {
            openPopout,
            closePopout,
            setPage,
            setModalCallback,
            openModal,
        } = useContext(routerStore);
        const { setBoecId, setPosition } = useContext(boecStore);

        const {
            data: brigadePositions,
            isLoading: isPositionsLoading,
            refetch,
        } = useQuery({
            queryKey: ["brigade-positions", brigadeId],
            queryFn: ({ queryKey }) => {
                return BrigadesAPI.getBrigadePositions({
                    brigadeId: queryKey[1] as number,
                    hideLast: isEditing ? false : true,
                });
            },
            retry: 1,
            refetchOnWindowFocus: false,
        });
        const { mutate: updatePosition } = useMutation<
            Position,
            Error,
            Position
        >(
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
        const { mutate: deleteMutation } = useMutation<
            Position,
            Error,
            Position
        >(
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
                    <ActionSheetItem
                        onClick={() => openEditModal(item)}
                        autoclose
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
                {brigadePositions &&
                    (brigadePositions.length === 0 ? (
                        <Footer>Ничего не найдено</Footer>
                    ) : (
                        brigadePositions.map((item) => (
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
    }
);
