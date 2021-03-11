import { Icon24Filter } from "@vkontakte/icons";
import { Footer, Header, Search, Spinner } from "@vkontakte/vkui";
import { debounce } from "lodash";
import { observer } from "mobx-react";
import {
    FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import InfiniteScroll from "react-infinite-scroller";
import { ModalContext } from "../../../ui/molecules/AbstractView";
import { useMst } from "../../stores";
import { Boec } from "../../types";
import { SoAPI } from "../../utils/api.service";
import { ListResponse } from "../../utils/types";
import { useFetch } from "../../utils/useFetch";

interface LazyUsersListProps {
    renderItem: (item: Boec<true>) => JSX.Element;
}
export const LazyUsersList: FC<LazyUsersListProps> = observer(
    ({ renderItem }): JSX.Element => {
        const store = useMst();

        const [search, setSearch] = useState<string>();
        const [filter, setFilter] = useState({
            search: undefined as string | undefined,
            limit: 20,
            offset: 0,
            brigadeId: undefined as string | undefined,
        });
        const [totalCount, setTotalCount] = useState<number>(0);
        const [data, setData] = useState<Boec<true>[]>();

        const loadMore = useCallback(() => {
            setFilter((prev) => ({
                search: prev.search,
                limit: 20,
                offset: prev.offset + prev.limit,
                brigadeId: prev.brigadeId,
            }));
        }, []);
        const loadMoreD = useMemo(
            () => debounce(loadMore || (() => undefined), 750),
            [loadMore]
        );
        const setFilterD = useMemo(
            () => debounce(setFilter || (() => undefined), 750),
            [setFilter]
        );
        const handleChange = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(event.target.value);
                setFilterD((prev) => ({
                    search: event.target.value,
                    limit: 20,
                    offset: 0,
                    brigadeId: prev.brigadeId,
                }));
            },
            [setFilterD]
        );
        const onLoad = useCallback((data: ListResponse<Boec<true>>) => {
            setTotalCount((prev) => {
                if (data.count === prev) {
                    setData((prev) => [
                        ...(prev ? prev : []),
                        ...data.items.filter(
                            (item) =>
                                !prev
                                    ?.map((prevItem) => prevItem.id)
                                    .includes(item.id)
                        ),
                    ]);
                } else {
                    setData(data.items);
                }

                return data.count;
            });
        }, []);

        const { fetch, errors, isLoading } = useFetch(SoAPI.getList, onLoad);
        const setFn = useCallback(
            (id?: string) => {
                setFilter((prev) => ({
                    search: prev.search,
                    limit: 20,
                    offset: 0,
                    brigadeId: id,
                }));
                store.router.closeModal();
            },
            [store.router]
        );
        const onFilterClick = () => {
            modalContext.setOnClose(setFn);
            store.router.openModal("MODAL_USERS_LIST");
        };
        const modalContext = useContext(ModalContext);
        useEffect(() => {
            fetch(filter);
        }, [fetch, filter]);

        return (
            <>
                <Search
                    value={search}
                    onChange={handleChange}
                    icon={<Icon24Filter />}
                    onIconClick={onFilterClick}
                />
                <Header mode="tertiary" indicator={totalCount}>
                    Люди
                </Header>

                <InfiniteScroll
                    pageStart={0}
                    initialLoad={false}
                    loadMore={loadMoreD}
                    hasMore={!isLoading && data && data.length < totalCount}
                >
                    {data && data.map((item) => renderItem(item))}

                    {isLoading && !errors && (
                        <Spinner size="small" style={{ margin: "20px 0" }} />
                    )}
                </InfiniteScroll>
                {!isLoading && data && data.length === 0 && (
                    <Footer>Ничего не найдено</Footer>
                )}
                {errors && <Footer>Ошибка соединения</Footer>}
            </>
        );
    }
);
