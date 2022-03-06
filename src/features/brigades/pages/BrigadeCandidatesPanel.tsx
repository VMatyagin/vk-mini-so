import { FC, useContext, useMemo, useRef } from "react";
import {
  ActionSheet,
  ActionSheetItem,
  Alert,
  Group,
  Panel,
  PanelHeaderBack,
  PanelProps,
  ScreenSpinner,
  SimpleCell,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { LazyList, LazyListControls } from "../../../ui/organisms/LazyList";
import { useRoute } from "react-router5";
import { routerStore } from "../../stores/router-store";
import { BrigadeApply } from "../../types";
import { Icon28CancelOutline, Icon28UserOutline } from "@vkontakte/icons";
import { useMutation } from "react-query";
import { getSafariFriendlyDate } from "../../utils/getSafariFriendlyDate";

export const BrigadeCandidatesPanel: FC<PanelProps> = observer((props) => {
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { openPopout, closePopout } = useContext(routerStore);
  const laztListRef = useRef<LazyListControls>(null);
  const { brigadeId } = useMemo(() => route.params, [route]);

  const { mutate: deleteMutation } = useMutation({
    mutationFn: BrigadesAPI.rejectBrigadeApply,
    onMutate: () => {
      openPopout(<ScreenSpinner />);
    },
    onSuccess: () => {
      closePopout();
      laztListRef.current?.refetch();
    },
    onError: closePopout,
  });
  const openProfile = (id: number) => {
    navigate("else.boec.details", { boecId: id });
  };
  const handleReject = (applyId: number) => {
    openPopout(
      <Alert
        actions={[
          {
            title: "Отклонить",
            mode: "destructive",
            autoclose: true,
            action: () => deleteMutation({ brigadeId, applyId }),
          },
          {
            title: "Отмена",
            autoclose: true,
            mode: "cancel",
          },
        ]}
        actionsLayout="vertical"
        onClose={closePopout}
        header="Подтвердите действие"
        text="Вы уверены, что хотите отклонить заявку?"
      />
    );
  };
  const handleOpenActionSheet = (toggleRef: Element, item: BrigadeApply) => {
    openPopout(
      <ActionSheet
        onClose={closePopout}
        iosCloseItem={
          <ActionSheetItem autoclose mode="cancel">
            Отменить
          </ActionSheetItem>
        }
        toggleRef={toggleRef}
      >
        <ActionSheetItem
          before={<Icon28UserOutline />}
          onClick={() => openProfile(item.boec.id)}
          autoclose
        >
          К профилю
        </ActionSheetItem>
        <ActionSheetItem
          autoclose
          before={<Icon28CancelOutline />}
          mode="destructive"
          onClick={() => handleReject(item.id)}
        >
          Отклонить
        </ActionSheetItem>
      </ActionSheet>
    );
  };
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Кандидаты
        </Title>
      </PanelHeader>
      <Group>
        <LazyList
          laztListRef={laztListRef}
          fetchFn={BrigadesAPI.getBrigadeApplies}
          queryKey={`brigade-${brigadeId}-candidates`}
          extraFnProp={{
            brigadeId,
          }}
          enabled={!!brigadeId}
          renderItem={(candidate) => (
            <SimpleCell
              key={candidate.boec.id}
              onClick={(event) =>
                handleOpenActionSheet(event.currentTarget, candidate)
              }
              description={getSafariFriendlyDate(
                candidate.createdAt,
                "YYYY-MM-DD"
              ).format("D MMMM YYYY")}
            >
              {candidate?.boec?.fullName}
            </SimpleCell>
          )}
        />
      </Group>
    </Panel>
  );
});
