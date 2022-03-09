import { Icon16ErrorCircleFill } from "@vkontakte/icons";
import {
  Avatar,
  CellButton,
  Group,
  Header,
  ScreenSpinner,
  Snackbar,
} from "@vkontakte/vkui";
import { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import React, { FC, useContext, useMemo, useState } from "react";
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
  const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
  const queryClient = useQueryClient();
  const { route } = useRoute();
  const { brigadeId, shtabId } = useMemo(() => route.params, [route]);

  const { mutate } = useMutation<Position<false>, Error, Partial<Position>>(
    (data) => {
      openPopout(<ScreenSpinner />);
      if (brigadeId) {
        return BrigadesAPI.setBrigadePosition({
          formData: data,
          brigadeId,
        });
      }
      return ShtabsAPI.setShtabPosition({
        formData: data,
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
      onError: (err) => {
        const error = err as AxiosError;

        closePopout();
        setSnackbar(
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={
              <Avatar size={24}>
                <Icon16ErrorCircleFill width={14} height={14} />
              </Avatar>
            }
          >
            {error.response?.data?.error}
          </Snackbar>
        );
      },
    }
  );
  const selectPosition = (formData: Partial<Position>) => {
    mutate(formData);
  };
  const openPositionSelecting = (boec: Boec) => {
    openModal(MODAL_BOEC_POSITION_SELECT);
    setModalCallback(
      MODAL_BOEC_POSITION_SELECT,
      ({ position, fromDate, toDate }: Position) =>
        selectPosition({
          boecId: boec.id,
          toDate,
          fromDate,
          position,
        })
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
      {snackbar}
    </Group>
  );
});
