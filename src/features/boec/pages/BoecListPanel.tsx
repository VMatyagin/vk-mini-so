import { FC, useCallback, useContext, useMemo, useState } from "react";
import {
  Group,
  Panel,
  PanelHeaderBack,
  Search,
  SimpleCell,
  PanelProps,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { LazyList } from "../../../ui/organisms/LazyList";
import { Icon24Filter } from "@vkontakte/icons";
import { debounce } from "@vkontakte/vkjs";
import { UsersAPI } from "../../utils/requests/user-request";
import { MODAL_BOEC_FILTER } from "../ui/modals/BoecFilterModal";
import { useRouter } from "react-router5";

export const BoecListPanel: FC<PanelProps> = observer((props) => {
  const { openModal, closeModal, setModalCallback } = useContext(routerStore);
  const router = useRouter();
  const changeView = (boecId: number) => {
    router.navigate("else.boec.details", { boecId });
  };

  const [search, setSearch] = useState<string>();
  const [filter, setFilter] = useState({
    search: undefined as string | undefined,

    brigadeId: undefined as string | undefined,
  });

  const setFilterD = useMemo(() => debounce(setFilter, 750), [setFilter]);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      setFilterD((prev) => ({
        search: event.target.value,

        brigadeId: prev.brigadeId,
      }));
    },
    [setFilterD]
  );

  const setFn = useCallback(
    (id?: string) => {
      setFilter((prev) => ({
        search: prev.search,

        brigadeId: id,
      }));
      closeModal();
    },
    [closeModal]
  );

  const onFilterClick = () => {
    setModalCallback(MODAL_BOEC_FILTER, setFn);
    openModal(MODAL_BOEC_FILTER);
  };
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Люди
        </Title>
      </PanelHeader>
      <Group>
        <Search
          value={search}
          onChange={handleChange}
          icon={<Icon24Filter />}
          onIconClick={onFilterClick}
        />
        <LazyList
          title="Бойцы"
          fetchFn={UsersAPI.getList}
          queryKey={"seasons-list"}
          extraFnProp={{
            search: filter.search,
            brigadeId: filter.brigadeId,
          }}
          renderItem={(item) => (
            <SimpleCell key={item.id} onClick={() => changeView(item.id)}>
              {item.fullName}
            </SimpleCell>
          )}
        />
      </Group>
    </Panel>
  );
});
