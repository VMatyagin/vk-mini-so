import { rootStore } from "../stores";

export const smoothScrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;

    if (c > 30) {
        return;
    }

    if (c > 0) {
        window.requestAnimationFrame(smoothScrollToTop);
        window.scrollTo(0, c - c / 8);
    }
};

export const restoreScrollPosition = () => {
    let scrolls = rootStore.app.componentScroll;
    Object.keys(scrolls).forEach((component) => {
        let componentData = scrolls[component];

        let element = document.getElementById(component) as HTMLElement;

        if (element) {
            element = element.getElementsByClassName(
                "HorizontalScroll__in"
            )[0] as HTMLElement;
            element.scrollLeft = componentData.x;
            element.scrollTop = componentData.y;
        }
    });
};

// Map RHF's dirtyFields over the `data` received by `handleSubmit` and return the changed subset of that data.
export function dirtyValues(
    dirtyFields: object | boolean,
    allValues: object
): object {
    // If *any* item in an array was modified, the entire array must be submitted, because there's no way to indicate
    // "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
    if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;
    // Here, we have an object
    return Object.fromEntries(
        Object.keys(dirtyFields).map((key) => [
            key,
            // @ts-ignore
            dirtyValues(dirtyFields[key], allValues[key]),
        ])
    );
}
