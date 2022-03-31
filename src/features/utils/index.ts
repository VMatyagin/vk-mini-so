import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { FieldNamesMarkedBoolean } from "react-hook-form";
import { appStore } from "../stores/app-store";

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

export const restoreScrollPosition = observer(() => {
    const { componentScroll: scrolls } = useContext(appStore);
    Object.keys(scrolls).forEach(component => {
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
    return null;
});

export const getDirtyFields = <DataType extends Record<string, any>>(
    data: DataType,
    dirtyFileds: FieldNamesMarkedBoolean<DataType>
): DataType => {
    let newData = {} as DataType;
    for (const [key] of Object.entries(dirtyFileds)) {
        newData[key as keyof DataType] = data[key];
    }
    return newData;
};
