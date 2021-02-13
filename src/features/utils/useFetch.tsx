import { ScreenSpinner } from "@vkontakte/vkui";
import { AxiosResponse } from "axios";
import React, { useCallback, useState } from "react";

import { useMst } from "../stores";
import { FailedResponse } from "./types";
type ThenArgRecursive<T> = T extends PromiseLike<infer U>
    ? ThenArgRecursive<U>
    : T;

type Procedure<R> = (...args: any[]) => Promise<ThenArgRecursive<R>>;

type DestructAxiosResponse<T extends AxiosResponse> = T["data"];

interface MirroredFunction<F extends Procedure<AxiosResponse<any>>> {
    (...args: Parameters<F>): void;
}

export const useFetch = <F extends Procedure<AxiosResponse<any>>>(
    fn: F
): {
    fetch: MirroredFunction<F>;
    data?: DestructAxiosResponse<ThenArgRecursive<ReturnType<F>>>;
    isLoading: boolean;
    errors: FailedResponse<any> | null;
} => {
    const store = useMst();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<
        DestructAxiosResponse<ThenArgRecursive<ReturnType<F>>>
    >();
    const [errors, setErrors] = useState<FailedResponse<any> | null>(null);

    const fetch: MirroredFunction<F> = useCallback(
        async (...args) => {
            setLoading(true);
            store.router.openPopout(<ScreenSpinner />);
            fn(...args)
                .then(({ data }) => {
                    setData(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setErrors(err);
                })
                .finally(() => {
                    store.router.closePopout();
                });
        },
        [fn, store.router]
    );

    return {
        fetch,
        data,
        isLoading,
        errors,
    };
};
