import { FC } from "react";
import {
  Footer,
  Group,
  Header,
  Panel,
  PanelHeaderBack,
  PanelSpinner,
  SimpleCell,
  Spinner,
  PanelProps,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useQuery } from "react-query";
import { ShtabsAPI } from "../../utils/requests/shtab-request";
import { useRouter } from "react-router5";

export const ShtabListPanel: FC<PanelProps> = observer((props) => {
  const { navigate } = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["shtab-list"],
    queryFn: () => ShtabsAPI.getShtabs({}),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleSelect = (shtabId: number) => {
    navigate("else.shtab.details", { shtabId });
  };

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Штабы
        </Title>
      </PanelHeader>
      <Group header={<Header mode="secondary">Штабы</Header>}>
        {isLoading && <PanelSpinner />}
        {!isLoading && data && data.count === 0 && (
          <Footer>Ничего не найдено</Footer>
        )}
        {isError && <Footer>Произошла ошибка</Footer>}

        {data ? (
          data.items.map((shtab) => (
            <SimpleCell
              key={shtab.id}
              expandable={true}
              onClick={() => handleSelect(shtab.id)}
            >
              {shtab.title}
            </SimpleCell>
          ))
        ) : (
          <Spinner size="small" style={{ margin: "20px 0" }} />
        )}
      </Group>
    </Panel>
  );
});
