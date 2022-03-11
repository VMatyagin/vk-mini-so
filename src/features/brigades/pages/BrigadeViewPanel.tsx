import React, { FC, useContext, useMemo, useState } from "react";
import {
  CellButton,
  Group,
  Header,
  InfoRow,
  Panel,
  PanelHeaderBack,
  PanelSpinner,
  SimpleCell,
  Title,
  PanelProps,
  Counter,
  Button,
  Div,
  Snackbar,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import {
  Icon28BabyBottleOutline,
  Icon28BookOutline,
  Icon28HashtagOutline,
} from "@vkontakte/icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { useRoute } from "react-router5";
import { appStore } from "../../stores/app-store";
import { ShtabOrBrigadeLeaders } from "../ui/molecules/ShtabOrBrigadeLeaders";
import { getSafariFriendlyDate } from "../../utils/getSafariFriendlyDate";

export const BrigadeViewPanel: FC<PanelProps> = observer((props) => {
  const { isStaff } = useContext(appStore);
  const [snackBar, setSnackBar] = useState<React.ReactNode>(null);
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { brigadeId } = useMemo(() => route.params, [route]);

  const handleOpenList = () => {
    navigate("else.brigade.seasons-list", { brigadeId });
  };
  const openRequests = () => {
    navigate("else.brigade.seasons-requests-list", { brigadeId });
  };
  const openCandidates = () => {
    navigate("else.brigade.candidates-list", { brigadeId });
  };

  const handleBrigadeEdit = () => {
    navigate("else.brigade.edit", { brigadeId });
  };
  const queryClient = useQueryClient();

  const { data: brigade, isLoading } = useQuery({
    queryKey: ["brigade", brigadeId],
    queryFn: ({ queryKey }) => {
      return BrigadesAPI.getBrigade(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!brigadeId,
  });
  const { isLoading: applyLoading, mutateAsync } = useMutation(
    BrigadesAPI.applyBrigade
  );
  const applyToBrigade = async () => {
    await mutateAsync(brigadeId);
    queryClient.setQueryData(["brigade", brigadeId], {
      ...brigade,
      applyStatus: "initial",
    });
    setSnackBar(
      <Snackbar onClose={() => setSnackBar(null)}>
        Супер! С тобой свяжутся
      </Snackbar>
    );
  };
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          {brigade?.title}
        </Title>
      </PanelHeader>
      {!isLoading ? (
        <>
          <Group
            header={<Header mode="secondary">Информация об отряде</Header>}
          >
            <SimpleCell disabled multiline>
              <InfoRow header="День рождения">
                {brigade?.dateOfBirth
                  ? getSafariFriendlyDate(brigade.dateOfBirth).format(
                      "D MMMM YYYY"
                    )
                  : "Не указан"}
              </InfoRow>
            </SimpleCell>
            <SimpleCell disabled>
              <InfoRow header="Штаб">{brigade?.shtab.title}</InfoRow>
            </SimpleCell>
            <SimpleCell disabled>
              <InfoRow header="Численность">{brigade?.members}</InfoRow>
            </SimpleCell>

            {brigade?.applyStatus !== "accepted" && (
              <Div>
                <Button
                  onClick={applyToBrigade}
                  stretched
                  size="m"
                  disabled={brigade?.applyStatus === "initial"}
                  loading={applyLoading}
                >
                  {brigade?.applyStatus !== "initial"
                    ? "Подать заявку"
                    : "Заявка отправлена"}
                </Button>
              </Div>
            )}
          </Group>
          <Group header={<Header mode="secondary">Командный состав</Header>}>
            <ShtabOrBrigadeLeaders />
          </Group>
          {(brigade?.canEdit || isStaff) && (
            <>
              <Group>
                <SimpleCell
                  before={<Icon28BookOutline />}
                  expandable={true}
                  onClick={handleOpenList}
                >
                  Отчеты за сезоны
                </SimpleCell>
                {!!brigade?.seasonRequestCount && (
                  <SimpleCell
                    before={<Icon28HashtagOutline />}
                    expandable={true}
                    onClick={openRequests}
                    after={
                      <Counter mode="secondary">
                        {brigade.seasonRequestCount}
                      </Counter>
                    }
                  >
                    Заявки на учет сезона
                  </SimpleCell>
                )}
                {!!brigade?.candidatesCount && (
                  <SimpleCell
                    before={<Icon28BabyBottleOutline />}
                    expandable={true}
                    onClick={openCandidates}
                    after={
                      <Counter mode="secondary">
                        {brigade.candidatesCount}
                      </Counter>
                    }
                  >
                    Кандидаты
                  </SimpleCell>
                )}
                {/* <SimpleCell
                                    before={<Icon28Flash />}
                                    expandable={true}
                                    // onClick={handleOpenList}
                                    // disabled={brigade?.requestCount === 0}
                                    // after={brigade?.requestCount}
                                >
                                    Заявки на вступление
                                </SimpleCell> */}
              </Group>
              <Group>
                <CellButton expandable={true} onClick={handleBrigadeEdit}>
                  Редактировать
                </CellButton>
              </Group>
            </>
          )}
        </>
      ) : (
        <PanelSpinner />
      )}
      {snackBar}
    </Panel>
  );
});
