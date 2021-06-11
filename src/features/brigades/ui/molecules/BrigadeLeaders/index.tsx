import {
    Icon28DeleteOutline,
    Icon28DeleteOutlineAndroid,
} from "@vkontakte/icons";
import {
    ActionSheet,
    ActionSheetItem,
    Cell,
    Footer,
    IOS,
    ScreenSpinner,
    Spinner,
    usePlatform,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useMutation, useQuery } from "react-query";
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
        const { openPopout, closePopout } = useContext(routerStore);
        const {
            data: brigadePositions,
            isLoading: isPositionsLoading,
            refetch,
        } = useQuery({
            queryKey: ["brigade-positions", brigadeId],
            queryFn: ({ queryKey }) => {
                return BrigadesAPI.getBrigadePositions({
                    brigadeId: queryKey[1] as number,
                });
            },
            retry: 1,
            refetchOnWindowFocus: false,
        });

        const { mutate } = useMutation<Position<false>, Error, number>(
            (positionId) => {
                openPopout(<ScreenSpinner />);

                return BrigadesAPI.removeBrigadePosition({
                    positionId,
                    brigadeId,
                });
            },
            {
                onSuccess: () => {
                    closePopout();
                    refetch();
                },
            }
        );
        const platform = usePlatform();
        const handleOpenActionSheet = (id: number) => {
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
                        autoclose
                        before={
                            platform === IOS ? (
                                <Icon28DeleteOutline />
                            ) : (
                                <Icon28DeleteOutlineAndroid />
                            )
                        }
                        mode="destructive"
                        onClick={() => mutate(id)}
                    >
                        Удалить
                    </ActionSheetItem>
                </ActionSheet>
            );
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
                            <Cell
                                description={positions[item.position].title}
                                onClick={() =>
                                    isEditing && handleOpenActionSheet(item.id)
                                }
                            >
                                {item.boec.fullName}
                            </Cell>
                        ))
                    ))}
            </>
        );
    }
);
