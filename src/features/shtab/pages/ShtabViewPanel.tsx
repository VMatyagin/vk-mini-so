import { FC, useMemo } from "react";
import {
  CellButton,
  Div,
  Footer,
  Group,
  Header,
  Panel,
  PanelHeaderBack,
  PanelSpinner,
  SimpleCell,
  Spinner,
  Title,
  PanelProps,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { Shtab } from "../../types";
import { useQuery } from "react-query";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { ShtabsAPI } from "../../utils/requests/shtab-request";
import { ShtabLeaders } from "../../boec/ui/molecules/ShtabLeaders";
import { useRoute } from "react-router5";

export const ShtabViewPanel: FC<PanelProps> = observer((props) => {
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { shtabId } = useMemo(() => route.params, [route]);

  const selectBrigade = (brigadeId: number) => {
    navigate("else.brigade.details", { brigadeId });
  };
  const openEdit = () => {
    navigate("else.shtab.edit", { shtabId });
  };
  const { data: shtabInfo } = useQuery<Shtab>({
    queryKey: ["shtab", shtabId],
    queryFn: ({ queryKey }) => {
      return ShtabsAPI.getShtab(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!shtabId,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: [shtabId],
    queryFn: () =>
      BrigadesAPI.getAreas({
        shtabId,
      }),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Штаб
        </Title>
      </PanelHeader>

      {!data || !shtabInfo ? (
        <Spinner size="small" style={{ margin: "20px 0" }} />
      ) : (
        <>
          <Group>
            <Div>
              <Title level="2" weight="medium">
                {shtabInfo.title}
              </Title>
            </Div>
          </Group>
          <Group header={<Header mode="secondary">Командый состав</Header>}>
            <ShtabLeaders />
          </Group>
          {isLoading && <PanelSpinner />}
          {!isLoading && data && data.count === 0 && (
            <Footer>Ничего не найдено</Footer>
          )}
          {isError && <Footer>Произошла ошибка</Footer>}
          {data &&
            data.items
              .filter((area) => area.brigades.length > 0)
              .sort((a, b) => b.brigades.length - a.brigades.length)
              .map((area) => (
                <Group
                  key={area.id}
                  header={<Header mode="secondary">{area.title}</Header>}
                >
                  {area.brigades.map((brigade) => (
                    <SimpleCell
                      key={brigade.id}
                      onClick={() => selectBrigade(brigade.id)}
                    >
                      {brigade.title}
                    </SimpleCell>
                  ))}
                </Group>
              ))}
          <Group>
            <CellButton onClick={openEdit}>Редактировать</CellButton>
          </Group>
        </>
      )}
    </Panel>
  );
});
