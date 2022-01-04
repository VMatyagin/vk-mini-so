import { Icon24Filter } from "@vkontakte/icons";
import { debounce } from "@vkontakte/vkjs";
import {
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  Search,
  SimpleCell,
  useAdaptivity,
  ViewWidth,
} from "@vkontakte/vkui";
import { useState, useMemo, useCallback } from "react";
import { LazyList } from "../../../../ui/organisms/LazyList";
import { RouterStoreInstance } from "../../../stores/router-store";
import { UsersAPI } from "../../../utils/requests/user-request";
import { MODAL_BOEC_FILTER } from "./BoecFilterModal";

export const MODAL_BOEC_LIST = "MODAL_BOEC_LIST";

export const BoecListModal = () => {
  const { closeModal, modalCallback, setModalCallback, openModal, modalProps } =
    RouterStoreInstance;

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState({
    search: undefined as string | undefined,
    brigadeId: undefined as string | undefined,
  });

  const setFilterD = useMemo(() => debounce(setFilter, 750), [setFilter]);
  const resetListFilter = () => {
    setFilter({
      brigadeId: undefined,
      search: undefined,
    });
    setSearch("");
  };
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

  const onBoecListClose = () => {
    closeModal();
    resetListFilter();
  };

  const { viewWidth = 100 } = useAdaptivity();
  const isMobile = viewWidth <= ViewWidth.MOBILE;

  return (
    <ModalPage
      id={MODAL_BOEC_LIST}
      settlingHeight={100}
      dynamicContentHeight={true}
      header={
        <ModalPageHeader
          left={isMobile && <PanelHeaderClose onClick={onBoecListClose} />}
        >
          Выбор бойца
        </ModalPageHeader>
      }
      onClose={onBoecListClose}
    >
      <Search
        value={search}
        onChange={handleChange}
        {...(modalProps
          ? {}
          : { icon: <Icon24Filter />, onIconClick: onFilterClick })}
        autoFocus={true}
      />
      <LazyList
        title="Бойцы"
        fetchFn={UsersAPI.getList}
        queryKey={"seasons-list"}
        extraFnProp={{
          search: filter.search,
          brigadeId: filter.brigadeId,
          ...(modalProps as object),
        }}
        renderItem={(item) => (
          <SimpleCell
            key={item.id}
            onClick={() => {
              modalCallback[MODAL_BOEC_LIST](item);
              resetListFilter();
            }}
          >
            {item.fullName}
          </SimpleCell>
        )}
      />
    </ModalPage>
  );
};
