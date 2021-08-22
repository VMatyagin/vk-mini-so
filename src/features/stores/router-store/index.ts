import * as VK from "../../VKBridge";
import { smoothScrollToTop } from "../../utils";
import { makeAutoObservable, runInAction } from "mobx";
import { createContext } from "react";

const defaultPage = {
    story: "else",
    view: "else",
    panel: "base",
};

export class RouterStore {
    activeStory: string = defaultPage.story;
    activeView: string = defaultPage.view;
    activePanel: string = defaultPage.panel;
    storiesHistory: string[] = [defaultPage.story];
    viewsHistory: Record<string, string[]> = {
        [defaultPage.story]: [defaultPage.view],
    };
    panelsHistory: Record<string, string[]> = {
        [defaultPage.view]: [defaultPage.panel],
    };
    activeModals: Record<string, string | null> = {};
    modalHistory: Record<string, string[]> = {};
    popouts: Record<string, JSX.Element | null> = {};
    modalCallback: Record<string, (...args: any[]) => void> = {};
    modalData: Record<string, unknown> = {};
    scrollPosition: Record<string, number> = {};
    lastAndroidBackAction: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    get history() {
        return this.panelsHistory[this.activeView] === undefined
            ? [this.activeView]
            : this.panelsHistory[this.activeView];
    }
    get popout() {
        return this.popouts[this.activeView] === undefined
            ? null
            : this.popouts[this.activeView];
    }
    get activeModal() {
        return this.activeModals[this.activeView] === undefined
            ? null
            : this.activeModals[this.activeView];
    }
    get pageScrollPosition() {
        return (
            this.scrollPosition[
                this.activeStory +
                    "_" +
                    this.activeView +
                    "_" +
                    this.activePanel
            ] || 0
        );
    }
    setModalCallback = (modal: string, cb: (...args: any[]) => void) => {
        this.modalCallback[modal] = cb;
    };
    get modalProps() {
        const activeModal = this.activeModals[this.activeView];
        if (activeModal) {
            return this.modalData[activeModal];
        }
        return null;
    }
    setLastAndroidBackAction = (action: number) => {
        this.lastAndroidBackAction = action;
    };

    getActiveStory() {
        return this.activeStory;
    }
    getActivePanel = (view: string) => {
        let panel = this.activePanel;
        let panelsHistory = this.panelsHistory;
        if (Object.keys(panelsHistory).includes(view)) {
            panel = panelsHistory[view][panelsHistory[view].length - 1];
        }
        return panel;
    };

    setPage = (view: string, panel: string) => {
        if (this.activeStory) {
            window.history.pushState(null, "");

            let panelsHistory = this.panelsHistory[view] || [];
            let viewsHistory = this.viewsHistory[this.activeStory] || [];
            const viewIndexInHistory = viewsHistory.indexOf(view);
            if (viewIndexInHistory !== -1) {
                viewsHistory = viewsHistory.filter(
                    (_, index) => index !== viewIndexInHistory
                );
            }

            if (panelsHistory.indexOf(panel) === -1) {
                panelsHistory = [...panelsHistory, panel];
            }

            if (panelsHistory.length > 1) {
                VK.swipeBackOn();
            }

            this.activePanel = panel;
            this.activeView = view;
            this.panelsHistory = {
                ...this.panelsHistory,
                [view]: panelsHistory,
            };
            this.viewsHistory = {
                ...this.viewsHistory,
                [this.activeStory]: [...viewsHistory, view],
            };
            this.scrollPosition = {
                ...this.scrollPosition,
                [this.activeStory +
                "_" +
                this.activeView +
                "_" +
                this.activePanel]: window.pageYOffset,
            };
        }
    };
    setStory = (story: string, initial_panel: string, initial_view: string) => {
        window.history.pushState(null, "");
        let viewsHistory = this.viewsHistory[story] || [story];

        let activeView = initial_view;
        let panelsHistory = [initial_panel];
        let activePanel = panelsHistory[panelsHistory.length - 1];

        if (panelsHistory.length > 1) {
            const firstPanel = panelsHistory[0];
            panelsHistory = [firstPanel];

            activePanel = panelsHistory[panelsHistory.length - 1];
        } else if (viewsHistory.length > 1) {
            let firstView = Array.from(viewsHistory).shift()!;
            viewsHistory = [firstView];

            activeView = viewsHistory[viewsHistory.length - 1];
            panelsHistory = this.panelsHistory[activeView];
            activePanel = panelsHistory[panelsHistory.length - 1];
        }

        if (
            story === this.activeStory &&
            panelsHistory.length === 1 &&
            window.pageYOffset > 0
        ) {
            window.scrollTo(0, 30);
            smoothScrollToTop();
        }

        let storiesHistory = this.storiesHistory;
        const storiesIndexInHistory = storiesHistory.indexOf(story);

        if (
            storiesIndexInHistory === -1 ||
            (storiesHistory[0] === story &&
                storiesHistory[storiesHistory.length - 1] !== story)
        ) {
            this.storiesHistory.push(story);
        }

        this.activeStory = story;
        this.activeView = activeView;
        this.activePanel = activePanel;
        this.viewsHistory = {
            ...this.viewsHistory,
            [activeView]: viewsHistory,
        };
        this.panelsHistory = {
            ...this.panelsHistory,
            [activeView]: panelsHistory,
        };
        this.scrollPosition = {
            ...this.scrollPosition,
            [this.activeStory + " " + this.activeView + "_" + this.activePanel]:
                window.pageYOffset,
        };
    };
    goBack = (_event?: any) => {
        let setView = this.activeView;
        let setPanel = this.activePanel;
        let setStory = this.activeStory;

        let popoutsData = this.popouts;

        if (popoutsData[setView]) {
            popoutsData[setView] = null;
            this.popouts = { ...this.popouts, ...popoutsData };
        }

        let viewModalsHistory = this.modalHistory[setView];

        if (viewModalsHistory !== undefined && viewModalsHistory.length !== 0) {
            let activeModal =
                viewModalsHistory[viewModalsHistory.length - 2] || null;

            if (activeModal === null) {
                viewModalsHistory = [];
            } else if (viewModalsHistory.indexOf(activeModal) !== -1) {
                viewModalsHistory = viewModalsHistory.splice(
                    0,
                    viewModalsHistory.indexOf(activeModal) + 1
                );
            } else {
                viewModalsHistory.push(activeModal);
            }
            this.activeModals = {
                ...this.activeModals,
                [setView]: activeModal,
            };
            this.modalHistory = {
                ...this.modalHistory,
                [setView]: viewModalsHistory,
            };
            return;
        }

        // история панелей
        let panelsHistory = this.panelsHistory[setView] || [];
        // история вью
        let viewsHistory = this.viewsHistory[this.activeStory] || [];
        // история сторис
        let storiesHistory = this.storiesHistory;

        if (panelsHistory.length > 1) {
            panelsHistory.pop();
            setPanel = panelsHistory[panelsHistory.length - 1];
        } else {
            // затирание истории панелей, если там осталась 1 панель
            delete this.panelsHistory[setView];

            if (viewsHistory.length > 1) {
                viewsHistory.pop();
                setView = viewsHistory[viewsHistory.length - 1];

                panelsHistory = this.panelsHistory[setView];

                setPanel = panelsHistory[panelsHistory.length - 1];
            } else if (storiesHistory.length > 1) {
                storiesHistory.pop();

                setStory = storiesHistory[storiesHistory.length - 1];
                setView =
                    this.viewsHistory[setStory][
                        this.viewsHistory[setStory].length - 1
                    ];

                let panelsHistoryNew = this.panelsHistory[setView];

                if (panelsHistoryNew.length > 1) {
                    setPanel = panelsHistoryNew[panelsHistoryNew.length - 1];
                } else {
                    setPanel = panelsHistoryNew[0];
                }
            } else {
                VK.closeApp();
            }
        }

        if (panelsHistory.length === 1) {
            VK.swipeBackOff();
        }

        this.activeView = setView;
        this.activePanel = setPanel;
        this.activeStory = setStory;

        this.viewsHistory = {
            ...this.viewsHistory,
            [this.activeView]: viewsHistory,
        };
        this.panelsHistory = {
            ...this.panelsHistory,
            [this.activeView]: panelsHistory,
        };
    };
    openPopout = (popout: JSX.Element) => {
        window.history.pushState(null, "");

        runInAction(() => {
            this.popouts = {
                ...this.popouts,
                [this.activeView]: popout,
            };
        });
    };
    closePopout = () => {
        this.popouts = {
            ...this.popouts,
            [this.activeView]: null,
        };
    };
    openModal = (id: string, data?: Record<string, unknown>) => {
        window.history.pushState(null, "");
        let activeModal = id || null;
        let modalsHistory = this.modalHistory[this.activeView]
            ? [...this.modalHistory[this.activeView]]
            : [];

        if (activeModal === null) {
            modalsHistory = [];
        } else if (modalsHistory.indexOf(activeModal) !== -1) {
            modalsHistory = modalsHistory.splice(
                0,
                modalsHistory.indexOf(activeModal) + 1
            );
        } else {
            modalsHistory.push(activeModal);
        }
        this.modalData = {
            ...this.modalData,
            [id]: data,
        };
        this.activeModals = {
            ...this.activeModals,
            [this.activeView]: activeModal,
        };
        this.modalHistory = {
            ...this.modalHistory,
            [this.activeView]: modalsHistory,
        };
    };
    closeModal = () => {
        let activeModal =
            this.modalHistory[this.activeView][
                this.modalHistory[this.activeView].length - 2
            ] || null;
        let modalsHistory = this.modalHistory[this.activeView]
            ? [...this.modalHistory[this.activeView]]
            : [];

        if (activeModal === null) {
            modalsHistory = [];
        } else if (modalsHistory.indexOf(activeModal) !== -1) {
            modalsHistory = modalsHistory.splice(
                0,
                modalsHistory.indexOf(activeModal) + 1
            );
        } else {
            modalsHistory.push(activeModal);
        }
        if (activeModal && this.modalData[activeModal]) {
            this.modalData = {
                ...this.modalData,
                [this.activeView]: null,
            };
        }

        this.activeModals = {
            ...this.activeModals,
            [this.activeView]: activeModal,
        };
        this.modalHistory = {
            ...this.modalHistory,
            [this.activeView]: modalsHistory,
        };
    };
    closeModalStack = () => {
        let activeModal = null;
        let modalsHistory = [] as string[];

        this.activeModals = {
            ...this.activeModals,
            [this.activeView]: activeModal,
        };
        this.modalHistory = {
            ...this.modalHistory,
            [this.activeView]: modalsHistory,
        };
    };
}

export const RouterStoreInstance = new RouterStore();

export const routerStore = createContext(RouterStoreInstance);
