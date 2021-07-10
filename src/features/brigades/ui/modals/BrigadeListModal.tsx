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
import { BrigadesAPI } from "../../../utils/requests/brigades-request";

export const MODAL_BRIGADE_LIST = "MODAL_BRIGADE_LIST";

export const BrigadeListModal = () => {
    const { closeModal, modalCallback } = RouterStoreInstance;

    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState({
        search: undefined as string | undefined,
    });

    const setFilterD = useMemo(() => debounce(setFilter, 750), [setFilter]);
    const resetListFilter = () => {
        setFilter({
            search: undefined,
        });
        setSearch("");
    };
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
            setFilterD({
                search: event.target.value,
            });
        },
        [setFilterD]
    );

    const onBoecListClose = () => {
        closeModal();
        resetListFilter();
    };

    const { viewWidth = 100 } = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;

    return (
        <ModalPage
            id={MODAL_BRIGADE_LIST}
            settlingHeight={100}
            dynamicContentHeight={true}
            header={
                <ModalPageHeader
                    left={
                        isMobile && (
                            <PanelHeaderClose onClick={onBoecListClose} />
                        )
                    }
                >
                    Выбор отряда
                </ModalPageHeader>
            }
            onClose={onBoecListClose}
        >
            <Search value={search} onChange={handleChange} autoFocus={true} />
            <LazyList
                title="Отряды"
                fetchFn={BrigadesAPI.getBrigadesList}
                queryKey={"brigade-list"}
                extraFnProp={{
                    search: filter.search,
                }}
                renderItem={(item) => (
                    <SimpleCell
                        key={item.id}
                        onClick={() => {
                            modalCallback[MODAL_BRIGADE_LIST](item);
                            resetListFilter();
                        }}
                    >
                        {item.title}
                    </SimpleCell>
                )}
            />
        </ModalPage>
    );
};
