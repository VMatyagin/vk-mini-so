import { useState, useEffect, useMemo } from "react";

const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
};
export const useIntersect = (
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
) => {
    const [node, setNode] = useState<Element | null>();
    const currentObserver = useMemo(
        () =>
            new IntersectionObserver(
                (entries) => {
                    const [target] = entries;
                    if (target.isIntersecting) {
                        callback(entries);
                    }
                },
                {
                    ...defaultOptions,
                    ...options,
                }
            ),
        [callback, options]
    );

    useEffect(() => {
        currentObserver.disconnect();

        if (node) {
            currentObserver.observe(node);
        }

        return () => {
            currentObserver.disconnect();
        };
    }, [currentObserver, node]);

    return { setNode };
};
