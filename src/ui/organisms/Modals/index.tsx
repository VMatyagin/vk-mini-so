import { Icon24Done, Icon24Filter } from "@vkontakte/icons";
import { debounce } from "@vkontakte/vkjs";
import {
    CustomSelectOption,
    FormItem,
    Group,
    IOS,
    ModalPage,
    ModalPageHeader,
    ModalRoot as MRoot,
    PanelHeaderButton,
    PanelHeaderClose,
    Search,
    Select,
    SimpleCell,
    Spinner,
    useAdaptivity,
    usePlatform,
    ViewWidth,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useCallback, useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { positions } from "../../../features/brigades/helpers";

import { routerStore } from "../../../features/stores/router-store";
import { Boec } from "../../../features/types";
import { BrigadesAPI } from "../../../features/utils/requests/brigades-request";
import { UsersAPI } from "../../../features/utils/requests/user-request";
import { LazyList } from "../LazyList";

export const MODAL_BOEC_FILTER = "MODAL_BOEC_FILTER";
export const MODAL_BOEC_LIST = "MODAL_BOEC_LIST";
export const MODAL_BOEC_POSITION_SELECT = "MODAL_BOEC_POSITION_SELECT";

export const Modals = observer(() => {
    const {
        activeModal,
        closeModal,
        modalCallback,
        setModalCallback,
        openModal,
        closeModalStack,
    } = useContext(routerStore);
    const [selectedBrigade, setBrigade] = useState<string>();
    const [selectedPosition, setPosition] = useState<string>();
    const [selectedUser, setBoec] = useState<Boec>();

    const { data: brigadesList } = useQuery({
        queryKey: ["brigades"],
        queryFn: () => BrigadesAPI.getBrigadesList({ limit: 200 }),
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: activeModal === MODAL_BOEC_FILTER,
    });

    const platform = usePlatform();
    const { viewWidth = 100 } = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;

    const [search, setSearch] = useState<string>("");
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
            setBrigade(undefined);
        },
        [closeModal]
    );

    const onFilterClick = () => {
        setModalCallback(MODAL_BOEC_FILTER, setFn);
        openModal(MODAL_BOEC_FILTER);
    };

    const onPositionSelect = () => {
        modalCallback[MODAL_BOEC_POSITION_SELECT](
            selectedUser!.id,
            selectedPosition
        );
        setBoec(undefined);
        closeModalStack();
        setPosition(undefined);
    };

    const openPositionSelecting = (boec: Boec) => {
        setBoec(boec);
        openModal(MODAL_BOEC_POSITION_SELECT);
    };

    const onBoecListClose = () => {
        closeModal();
        setFilter({
            brigadeId: undefined,
            search: undefined,
        });
        setSearch("");
    };

    const onSelectPositionClose = () => {
        closeModal();
        setPosition(undefined);
    };
    return (
        <MRoot activeModal={activeModal} onClose={closeModal}>
            <ModalPage
                id={MODAL_BOEC_FILTER}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        left={
                            isMobile && (
                                <PanelHeaderClose onClick={closeModal} />
                            )
                        }
                        right={
                            <PanelHeaderButton
                                onClick={() => {
                                    modalCallback[MODAL_BOEC_FILTER](
                                        selectedBrigade
                                    );
                                }}
                            >
                                {platform === IOS ? "Готово" : <Icon24Done />}
                            </PanelHeaderButton>
                        }
                    >
                        Фильтры
                    </ModalPageHeader>
                }
                onClose={closeModal}
            >
                {!brigadesList && (
                    <Spinner size="small" style={{ margin: "20px 0" }} />
                )}
                {brigadesList && (
                    <Group style={{ minHeight: 300 }}>
                        <FormItem top="Отряд">
                            <Select
                                placeholder="Не выбран"
                                value={selectedBrigade}
                                options={brigadesList.items.map((user) => ({
                                    label: user.title,
                                    value: user.id,
                                }))}
                                onChange={(e) => {
                                    setBrigade(e.target.value);
                                }}
                                renderOption={({ option, ...restProps }) => (
                                    <CustomSelectOption {...restProps} />
                                )}
                            />
                        </FormItem>
                    </Group>
                )}
            </ModalPage>
            <ModalPage
                id={MODAL_BOEC_LIST}
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
                        Выбор бойца
                    </ModalPageHeader>
                }
                onClose={onBoecListClose}
            >
                <Search
                    value={search}
                    onChange={handleChange}
                    icon={<Icon24Filter />}
                    onIconClick={onFilterClick}
                />
                <LazyList
                    title="Бойцы"
                    fetchFn={UsersAPI.getList}
                    queryKey={"boec-list"}
                    extraFnProp={{
                        search: filter.search,
                        brigadeId: filter.brigadeId,
                    }}
                    renderItem={(item) => (
                        <SimpleCell
                            key={item.id}
                            onClick={() => openPositionSelecting(item)}
                        >
                            {item.fullName}
                        </SimpleCell>
                    )}
                />
            </ModalPage>
            <ModalPage
                id={MODAL_BOEC_POSITION_SELECT}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        left={
                            isMobile && (
                                <PanelHeaderClose
                                    onClick={onSelectPositionClose}
                                />
                            )
                        }
                        right={
                            selectedUser &&
                            selectedPosition && (
                                <PanelHeaderButton onClick={onPositionSelect}>
                                    {platform === IOS ? (
                                        "Готово"
                                    ) : (
                                        <Icon24Done />
                                    )}
                                </PanelHeaderButton>
                            )
                        }
                    >
                        Выбор должности
                    </ModalPageHeader>
                }
                onClose={onSelectPositionClose}
            >
                <Group style={{ minHeight: 300 }}>
                    <FormItem top={selectedUser?.fullName}>
                        <Select
                            placeholder="Не выбран"
                            value={selectedPosition}
                            options={positions.map((position, index) => ({
                                label: position.title,
                                value: index,
                            }))}
                            onChange={(e) => {
                                setPosition(e.target.value);
                            }}
                            renderOption={({ option, ...restProps }) => (
                                <CustomSelectOption {...restProps} />
                            )}
                        />
                    </FormItem>
                </Group>
            </ModalPage>
        </MRoot>
    );
});
