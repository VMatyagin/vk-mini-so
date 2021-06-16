import { CellButton, Group, Header, ScreenSpinner } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { MODAL_BOEC_LIST } from "../../../../boec/ui/modals/BoecListModal";
import { MODAL_BOEC_POSITION_SELECT } from "../../../../boec/ui/modals/LeaderPositionModal";
import { routerStore } from "../../../../stores/router-store";
import { Boec, Position } from "../../../../types";
import { BrigadesAPI } from "../../../../utils/requests/brigades-request";
import { brigadeStore } from "../../../store/brigadeStore";
import { BrigadeLeaders } from "../BrigadeLeaders";

interface PositionsFormProps {}

export const PositionsForm: FC<PositionsFormProps> = observer(() => {
    const { brigadeId } = useContext(brigadeStore);
    const { setModalCallback, openModal, openPopout, closePopout } =
        useContext(routerStore);
    const queryClient = useQueryClient();

    const { mutate } = useMutation<
        Position<false>,
        Error,
        {
            boec: number;
            position: number;
        }
    >(
        (data) => {
            openPopout(<ScreenSpinner />);
            return BrigadesAPI.setBrigadePosition({
                boec: data.boec,
                position: data.position,
                brigadeId: brigadeId!,
            });
        },
        {
            onSuccess: () => {
                closePopout();
                queryClient.refetchQueries(["brigade-positions", brigadeId]);
            },
        }
    );
    const selectPosition = (userId: number, position: string) => {
        mutate({
            boec: userId,
            position: Number(position),
        });
    };
    const openPositionSelecting = (boec: Boec) => {
        openModal(MODAL_BOEC_POSITION_SELECT);
        setModalCallback(MODAL_BOEC_POSITION_SELECT, (position) =>
            selectPosition(boec.id, position)
        );
    };
    const onAddClick = () => {
        setModalCallback(MODAL_BOEC_LIST, openPositionSelecting);
        openModal(MODAL_BOEC_LIST);
    };
    return (
        <Group header={<Header mode="secondary">Командый состав</Header>}>
            <BrigadeLeaders brigadeId={brigadeId!} isEditing={true} />
            <CellButton onClick={onAddClick}>Добавить</CellButton>
        </Group>
    );
});
