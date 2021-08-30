import { FC, useContext, useMemo } from "react";
import {
  CellButton,
  Group,
  Header,
  InfoRow,
  Panel,
  PanelHeaderBack,
  PanelSpinner,
  ScreenSpinner,
  SimpleCell,
  Title,
  PanelProps,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { Icon28UsersOutline } from "@vkontakte/icons";
import { useQuery } from "react-query";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { BrigadeLeaders } from "../ui/molecules/BrigadeLeaders";
import { useRoute } from "react-router5";

export const BrigadeViewPanel: FC<PanelProps> = observer((props) => {
  const { openPopout, closePopout } = useContext(routerStore);
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { brigadeId } = useMemo(() => route.params, [route]);

  const handleOpenList = () => {
    navigate("else.brigade.boec-list", { brigadeId });
  };

  const handleBrigadeEdit = () => {
    navigate("else.brigade.edit", { brigadeId });
  };

  const { data: brigade, isLoading } = useQuery({
    queryKey: ["brigade", brigadeId],
    queryFn: ({ queryKey }) => {
      openPopout(<ScreenSpinner />);
      return BrigadesAPI.getBrigade(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!brigadeId,
    onSuccess: closePopout,
  });

  const handleAddBoec = () => {
    navigate("else.boec.create");
  };

  return (
    <Panel {...props}>
      {!isLoading ? (
        <>
          <PanelHeader
            left={<PanelHeaderBack onClick={() => window.history.back()} />}
          >
            <Title level="2" weight="bold">
              {brigade?.title}
            </Title>
          </PanelHeader>
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
              <InfoRow header="Численность">{brigade?.boecCount}</InfoRow>
            </SimpleCell>
          </Group>
          <Group header={<Header mode="secondary">Командый состав</Header>}>
            <BrigadeLeaders />
          </Group>
          <Group>
            <SimpleCell
              before={<Icon28UsersOutline />}
              expandable={true}
              onClick={handleOpenList}
            >
              Cписок бойцов
            </SimpleCell>
            <CellButton expandable={true} onClick={handleBrigadeEdit}>
              Редактировать
            </CellButton>
            <CellButton onClick={handleAddBoec}>Добавить бойца</CellButton>
          </Group>
        </>
      ) : (
        <PanelSpinner />
      )}
    </Panel>
  );
});
