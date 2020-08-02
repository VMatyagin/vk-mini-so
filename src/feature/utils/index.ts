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

export const getActivePanel = (view: string) => {
  let panel = rootStore.router.activePanel;
  let panelsHistory = rootStore.router.panelsHistory;
  if (typeof panelsHistory[view] !== "undefined") {
    panel = panelsHistory[view][panelsHistory[view].length - 1];
  }
  return panel;
};
