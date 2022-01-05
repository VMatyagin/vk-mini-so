import { CellButton, Group, Header, ScreenSpinner } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRoute } from "react-router5";
import { MODAL_BOEC_LIST } from "../../../../boec/ui/modals/BoecListModal";
import { MODAL_BOEC_POSITION_SELECT } from "../../../../boec/ui/modals/LeaderPositionModal";
import { routerStore } from "../../../../stores/router-store";
import { Boec, Position } from "../../../../types";
import { BrigadesAPI } from "../../../../utils/requests/brigades-request";
import { ShtabsAPI } from "../../../../utils/requests/shtab-request";
import { ShtabOrBrigadeLeaders } from "../ShtabOrBrigadeLeaders";

export const PositionsForm: FC = observer(() => {
  const { setModalCallback, openModal, openPopout, closePopout } =
    useContext(routerStore);
  const queryClient = useQueryClient();
  const { route } = useRoute();
  const { brigadeId, shtabId } = useMemo(() => route.params, [route]);

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
      if (brigadeId) {
        return BrigadesAPI.setBrigadePosition({
          boec: data.boec,
          position: data.position,
          brigadeId,
        });
      }
      return ShtabsAPI.setShtabPosition({
        boec: data.boec,
        position: data.position,
        shtabId,
      });
    },
    {
      onSuccess: () => {
        closePopout();
        queryClient.refetchQueries([
          brigadeId ? "brigade-positions" : "shtab-positions",
          brigadeId || shtabId,
        ]);
      },
    }
  );
  const selectPosition = (userId: number, position: number) => {
    mutate({
      boec: userId,
      position,
    });
  };
  const openPositionSelecting = (boec: Boec) => {
    openModal(MODAL_BOEC_POSITION_SELECT);
    setModalCallback(MODAL_BOEC_POSITION_SELECT, ({ position }: Position) =>
      selectPosition(boec.id, position)
    );
  };
  const onAddClick = () => {
    setModalCallback(MODAL_BOEC_LIST, openPositionSelecting);
    openModal(MODAL_BOEC_LIST);
  };
  return (
    <Group header={<Header mode="secondary">Командный состав</Header>}>
      <ShtabOrBrigadeLeaders isEditing={true} />
      <CellButton onClick={onAddClick}>Добавить</CellButton>
    </Group>
  );
});
