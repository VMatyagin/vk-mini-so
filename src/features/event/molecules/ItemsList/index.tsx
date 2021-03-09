import { Footer, Spinner } from "@vkontakte/vkui";

import { ArrayElement } from "../../../types";

interface ItemsListProps<T extends Array<ArrayElement<T>>> {
    data?: T;
    isLoading: boolean;
    isError: boolean;
    renderItem: (item: ArrayElement<T>) => JSX.Element;
}
export const ItemsList = <T extends Array<ArrayElement<T>>>({
    data,
    isLoading,
    isError,
    renderItem,
}: ItemsListProps<T>): JSX.Element => {
    return (
        <>
            {data && data.map((item) => renderItem(item))}
            {isLoading && !isError && (
                <Spinner size="small" style={{ margin: "20px 0" }} />
            )}
            {!isLoading && data && data.length === 0 && (
                <Footer>Ничего не найдено</Footer>
            )}
            {isError && <Footer>Ошибка соединения</Footer>}
        </>
    );
};
