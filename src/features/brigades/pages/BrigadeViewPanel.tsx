import { FC, useContext, useMemo } from "react";
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
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { Icon28BookOutline, Icon28HashtagOutline } from "@vkontakte/icons";
import { useQuery } from "react-query";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { useRoute } from "react-router5";
import { appStore } from "../../stores/app-store";
import { ShtabOrBrigadeLeaders } from "../ui/molecules/ShtabOrBrigadeLeaders";

export const BrigadeViewPanel: FC<PanelProps> = observer((props) => {
  const { isStaff } = useContext(appStore);
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

  const handleBrigadeEdit = () => {
    navigate("else.brigade.edit", { brigadeId });
  };

  const { data: brigade, isLoading } = useQuery({
    queryKey: ["brigade", brigadeId],
    queryFn: ({ queryKey }) => {
      return BrigadesAPI.getBrigade(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!brigadeId,
  });

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
            <SimpleCell multiline>
              <InfoRow header="День рождения">
                {brigade?.dateOfBirth
                  ? new Date(brigade.dateOfBirth).toLocaleDateString()
                  : "Не указан"}
              </InfoRow>
            </SimpleCell>
            <SimpleCell>
              <InfoRow header="Штаб">{brigade?.shtab.title}</InfoRow>
            </SimpleCell>
            <SimpleCell>
              <InfoRow header="Численность">{brigade?.members}</InfoRow>
            </SimpleCell>
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
    </Panel>
  );
});
