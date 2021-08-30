import { FC, useCallback, useMemo, useState } from "react";
import {
  Group,
  Panel,
  PanelHeaderBack,
  PanelProps,
  Search,
  SimpleCell,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { LazyList } from "../../../ui/organisms/LazyList";
import { debounce } from "@vkontakte/vkjs";
import { useRouter } from "react-router5";

export const BrigadeListPanel: FC<PanelProps> = observer((props) => {
  const { navigate } = useRouter();
  const [filter, setFilter] = useState({
    search: undefined as string | undefined,
  });
  const selectBrigade = (brigadeId: number) => {
    navigate("else.brigade.details", { brigadeId });
  };
  const [search, setSearch] = useState<string>();

  const setFilterD = useMemo(() => debounce(setFilter, 750), [setFilter]);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      setFilterD({
        search: event.target.value,
      });
    },
    [setFilterD]
  );

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Отряды
        </Title>
      </PanelHeader>
      <Group>
        <Search value={search} onChange={handleChange} />

        <LazyList
          fetchFn={BrigadesAPI.getBrigadesList}
          queryKey={"brigade-list-sort"}
          extraFnProp={{
            search: filter.search,
          }}
          renderItem={(brigade) => (
            <SimpleCell
              key={brigade.id}
              onClick={() => selectBrigade(brigade.id)}
            >
              {brigade.title}
            </SimpleCell>
          )}
        />
      </Group>
    </Panel>
  );
});
