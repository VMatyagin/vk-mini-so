import { Icon16Cancel } from "@vkontakte/icons";
import { Avatar, Snackbar } from "@vkontakte/vkui";
import axios, { AxiosResponse } from "axios";
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

interface ReturnProps<F extends Procedure<AxiosResponse<any>>> {
    fetch: MirroredFunction<F>;
    // data?: DestructAxiosResponse<ThenArgRecursive<ReturnType<F>>>;

    isLoading: boolean;
    errors: FailedResponse<any> | null;
}

export const useFetch = <F extends Procedure<AxiosResponse<any>>>(
    fn: F,
    onLoad: (
        data: DestructAxiosResponse<ThenArgRecursive<ReturnType<F>>>
    ) => void
): ReturnProps<F> => {
    const store = useMst();

    const [isLoading, setLoading] = useState<boolean>(false);

    const [errors, setErrors] = useState<FailedResponse<any> | null>(null);

    const fetch: MirroredFunction<F> = useCallback(
        async (...args) => {
            setLoading(true);
            fn(...args)
                .then(({ data }) => {
                    console.log(data);

                    onLoad(data);
                    setLoading(false);
                })
                .catch((err) => {
                    if (!axios.isCancel(err)) {
                        store.router.openPopout(
                            <Snackbar
                                onClose={store.router.closePopout}
                                before={
                                    <Avatar
                                        size={24}
                                        style={{
                                            background: "var(--destructive)",
                                        }}
                                    >
                                        <Icon16Cancel
                                            fill="#fff"
                                            width={14}
                                            height={14}
                                        />
                                    </Avatar>
                                }
                            >
                                Ошибка соединения
                            </Snackbar>
                        );
                        setErrors(err);
                    }
                });
        },
        [fn, onLoad, store.router]
    );
    return {
        fetch,
        isLoading,
        errors,
    };
};
