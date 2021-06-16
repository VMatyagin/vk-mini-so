import { Icon24Done, Icon24Filter } from "@vkontakte/icons";
import { debounce } from "@vkontakte/vkjs";
import {
    Cell,
    CellButton,
    CustomSelectOption,
    Footer,
    FormItem,
    Group,
    Header,
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
import { eventStore } from "../../../features/event/store/eventStore";

import { routerStore } from "../../../features/stores/router-store";
import { Boec, Nomination } from "../../../features/types";
import { BrigadesAPI } from "../../../features/utils/requests/brigades-request";
import { EventAPI } from "../../../features/utils/requests/event-request";
import { UsersAPI } from "../../../features/utils/requests/user-request";
import { LazyList } from "../LazyList";
import { LazySelect } from "../LazySelect";

export const MODAL_BOEC_FILTER = "MODAL_BOEC_FILTER";
export const MODAL_BOEC_LIST = "MODAL_BOEC_LIST";
export const MODAL_BOEC_POSITION_SELECT = "MODAL_BOEC_POSITION_SELECT";
export const MODAL_BOEC_SELECTING = "MODAL_BOEC_SELECTING";
export const MODAL_EVENT_NOMINATION_SELECT = "MODAL_EVENT_NOMINATION_SELECT";

export const Modals = observer(() => {
    const {
        activeModal,
        closeModal,
        modalCallback,
        setModalCallback,
        openModal,
        closeModalStack,
    } = useContext(routerStore);
    const { competitionId } = useContext(eventStore);
    const [selectedBrigade, setBrigade] = useState<string>();
    const [boecs, setBoecs] = useState<Boec[]>([]);
    const [selectedPosition, setPosition] = useState<string>();
    const [selectedNomination, setNomination] = useState<number>();

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
            setBrigade(undefined);
        },
        [closeModal]
    );

    const onFilterClick = () => {
        setModalCallback(MODAL_BOEC_FILTER, setFn);
        openModal(MODAL_BOEC_FILTER);
    };

    const onPositionSelect = () => {
        modalCallback[MODAL_BOEC_POSITION_SELECT](selectedPosition);
        closeModalStack();
        setPosition(undefined);
    };

    const onBoecListClose = () => {
        closeModal();
        resetListFilter();
    };

    const onSelectPositionClose = () => {
        closeModal();
        setPosition(undefined);
    };

    const onBoecSelecting = () => {
        modalCallback[MODAL_BOEC_SELECTING](boecs);
        closeModal();
        setBoecs([]);
    };
    const onBoecSelectingClose = () => {
        closeModal();
        setBoecs([]);
    };
    const openBoecListModal = () => {
        setModalCallback(MODAL_BOEC_LIST, (boec: Boec) => {
            setBoecs((prev) => {
                if (prev.includes(boec)) {
                    return prev;
                } else {
                    return [...prev, boec];
                }
            });
            closeModal();
        });
        openModal(MODAL_BOEC_LIST);
    };
    const handleRemove = (boec: Boec) => {
        setBoecs((prev) => prev.filter((item) => item !== boec));
    };

    const onSelectNominationClose = () => {
        closeModal();
        setNomination(undefined);
    };

    const onNominationSelect = () => {
        modalCallback[MODAL_EVENT_NOMINATION_SELECT](selectedNomination);
        setNomination(undefined);
        closeModal();
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
                    <FormItem top="Должность">
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
            <ModalPage
                id={MODAL_BOEC_SELECTING}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        left={
                            isMobile && (
                                <PanelHeaderClose
                                    onClick={onBoecSelectingClose}
                                />
                            )
                        }
                        right={
                            boecs.length > 0 && (
                                <PanelHeaderButton onClick={onBoecSelecting}>
                                    {platform === IOS ? (
                                        "Готово"
                                    ) : (
                                        <Icon24Done />
                                    )}
                                </PanelHeaderButton>
                            )
                        }
                    >
                        Выбор бойцов
                    </ModalPageHeader>
                }
                onClose={onBoecSelectingClose}
            >
                <Group>
                    <CellButton onClick={openBoecListModal}>Выбрать</CellButton>
                </Group>
                <Group header={<Header mode="secondary">Выбрано</Header>}>
                    {boecs.length === 0 ? (
                        <Footer>Ничего не выбрано</Footer>
                    ) : (
                        boecs.map((boec) => (
                            <Cell
                                removable={true}
                                onRemove={() => handleRemove(boec)}
                                key={boec.id}
                            >
                                {boec.fullName}
                            </Cell>
                        ))
                    )}
                </Group>
            </ModalPage>

            <ModalPage
                id={MODAL_EVENT_NOMINATION_SELECT}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        left={
                            isMobile && (
                                <PanelHeaderClose
                                    onClick={onSelectNominationClose}
                                />
                            )
                        }
                        right={
                            selectedNomination && (
                                <PanelHeaderButton onClick={onNominationSelect}>
                                    {platform === IOS ? (
                                        "Готово"
                                    ) : (
                                        <Icon24Done />
                                    )}
                                </PanelHeaderButton>
                            )
                        }
                    >
                        Выбор номинации
                    </ModalPageHeader>
                }
                onClose={onSelectNominationClose}
            >
                <Group style={{ minHeight: 300 }}>
                    <FormItem top="Номинация">
                        <LazySelect
                            name={"nominations"}
                            onChange={(value) =>
                                setNomination(Number(value.target.value))
                            }
                            value={selectedNomination}
                            fetchFn={EventAPI.getCompetitionNominations}
                            extraFnProp={{ competitionId }}
                            queryKey={`nominations-${competitionId}`}
                            parseItem={(nomination: Nomination) => ({
                                label: nomination.title,
                                value: nomination.id,
                            })}
                        />
                    </FormItem>
                </Group>
            </ModalPage>
        </MRoot>
    );
});
