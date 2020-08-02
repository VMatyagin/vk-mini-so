import { types } from "mobx-state-tree";
import * as VK from "../../VKBridge";
import { smoothScrollToTop } from "../../utils";

export const RouterStore = types
  .model("RouterStore", {
    activeStory: types.optional(types.string, ""),
    activeView: types.optional(types.string, ""),
    activePanel: types.optional(types.string, ""),
    storiesHistory: types.array(types.string),
    viewsHistory: types.frozen<{ [propName: string]: string[] }>({}),
    panelsHistory: types.frozen<{ [propName: string]: string[] }>({}),
    activeModals: types.frozen<{
      [propName: string]: string | null;
    }>({}),
    modalHistory: types.frozen<{ [propName: string]: string[] }>({}),
    popouts: types.frozen<{ [propName: string]: string | null }>({}),
    scrollPosition: types.frozen<{ [propName: string]: number }>({}),
  }).views((self) => ({
    getActiveStory() {
      return self.activeStory
    }
  }))
  .actions((self) => ({
    setPage(view: string, panel: string) {
      window.history.pushState(null, "");
      let viewsHistory = self.viewsHistory[self.activeStory] || [];
      const viewIndexInHistory = viewsHistory.indexOf(view);

      if (viewIndexInHistory !== -1) {
        viewsHistory.splice(viewIndexInHistory, 1);
      }

      let panelsHistory = self.panelsHistory[view];
      if (panelsHistory.indexOf(panel) === -1) {
        panelsHistory = [...panelsHistory, panel];
      }

      if (panelsHistory.length > 1) {
        VK.swipeBackOn();
      }

      self.activeView = view;
      self.activePanel = panel;
      self.panelsHistory = { ...self.panelsHistory, [view]: panelsHistory };
      self.viewsHistory = {
        ...self.viewsHistory,
        [self.activeStory]: [...viewsHistory, view],
      };
      self.scrollPosition[
        self.activeStory + " " + self.activeView + "_" + self.activePanel
      ] = window.pageYOffset;
    },
    setStory(story: string, initial_panel: string) {      
      window.history.pushState(null, "");
      let viewsHistory = self.viewsHistory[story] || [story];

      let activeView = viewsHistory[viewsHistory.length - 1];
      let panelsHistory = self.panelsHistory[activeView] || [initial_panel];
      let activePanel = panelsHistory[panelsHistory.length - 1];

      if (story === self.activeStory) {
        if (panelsHistory.length > 1) {
          const firstPanel = panelsHistory.shift()!;
          panelsHistory = [firstPanel];

          activePanel = panelsHistory[panelsHistory.length - 1];
        } else if (viewsHistory.length > 1) {
          let firstView = viewsHistory.shift()!;
          viewsHistory = [firstView];

          activeView = viewsHistory[viewsHistory.length - 1];
          panelsHistory = self.panelsHistory[activeView];
          activePanel = panelsHistory[panelsHistory.length - 1];
        }
      }

      if (
        story === self.activeStory &&
        panelsHistory.length === 1 &&
        window.pageYOffset > 0
      ) {
        window.scrollTo(0, 30);
        smoothScrollToTop();
      }

      let storiesHistory = self.storiesHistory;
      const storiesIndexInHistory = storiesHistory.indexOf(story);

      if (
        storiesIndexInHistory === -1 ||
        (storiesHistory[0] === story &&
          storiesHistory[storiesHistory.length - 1] !== story)
      ) {
        self.storiesHistory.push(story);
      }

      self.activeStory = story;
      self.activeView = activeView;
      self.activePanel = activePanel;
      self.viewsHistory = { ...self.viewsHistory, [activeView]: viewsHistory };
      self.panelsHistory = {
        ...self.panelsHistory,
        [activeView]: panelsHistory,
      };
      self.scrollPosition = {
        ...self.scrollPosition,
        [self.activeStory +
        " " +
        self.activeView +
        "_" +
        self.activePanel]: window.pageYOffset,
      };
    },
    goBack() {
      let setView = self.activeView;
      let setPanel = self.activePanel;
      let setStory = self.activeStory;

      let popoutsData = self.popouts;

      if (popoutsData[setView]) {
        popoutsData[setView] = null;
        return false;
      }

      let viewModalsHistory = self.modalHistory[setView];

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
        self.activeModals = { ...self.activeModals, [setView]: activeModal };
        self.modalHistory = {
          ...self.modalHistory,
          [setView]: viewModalsHistory,
        };
        return false;
      }

      let panelsHistory = self.panelsHistory[setView] || [];
      let viewsHistory = self.viewsHistory[self.activeStory] || [];
      let storiesHistory = self.storiesHistory;

      if (panelsHistory.length > 1) {
        panelsHistory.pop();

        setPanel = panelsHistory[panelsHistory.length - 1];
      } else if (viewsHistory.length > 1) {
        viewsHistory.pop();

        setView = viewsHistory[viewsHistory.length - 1];
        let panelsHistoryNew = self.panelsHistory[setView];

        setPanel = panelsHistoryNew[panelsHistoryNew.length - 1];
      } else if (storiesHistory.length > 1) {
        storiesHistory.pop();

        setStory = storiesHistory[storiesHistory.length - 1];
        setView =
          self.viewsHistory[setStory][self.viewsHistory[setStory].length - 1];

        let panelsHistoryNew = self.panelsHistory[setView];

        if (panelsHistoryNew.length > 1) {
          setPanel = panelsHistoryNew[panelsHistoryNew.length - 1];
        } else {
          setPanel = panelsHistoryNew[0];
        }
      } else {
        VK.closeApp();
      }

      if (panelsHistory.length === 1) {
        VK.swipeBackOff();
      }

      self.activeView = setView;
      self.activePanel = setPanel;
      self.activeStory = setStory;
      self.viewsHistory = {
        ...self.viewsHistory,
        [self.activeView]: viewsHistory,
      };
      self.panelsHistory = {
        ...self.panelsHistory,
        [self.activeView]: panelsHistory,
      };
      return false;
    },
    openPopout(popout: string) {
      window.history.pushState(null, "");

      self.popouts = {
        ...self.popouts,
        [self.activeView]: popout,
      };
    },
    closePopout() {
      self.popouts = {
        ...self.popouts,
        [self.activeView]: null,
      };
    },
    openModal(id: string) {
      window.history.pushState(null, "");
      let activeModal = id || null;
      let modalsHistory = self.modalHistory[self.activeView]
        ? [...self.modalHistory[self.activeView]]
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
      self.activeModals = {
        ...self.activeModals,
        [self.activeView]: activeModal,
      };
      self.modalHistory = {
        ...self.modalHistory,
        [self.activeView]: modalsHistory,
      };
    },
    closeModal() {
      let activeModal =
        self.modalHistory[self.activeView][
          self.modalHistory[self.activeView].length - 2
        ] || null;
      let modalsHistory = self.modalHistory[self.activeView]
        ? [...self.modalHistory[self.activeView]]
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
      self.activeModals = {
        ...self.activeModals,
        [self.activeView]: activeModal,
      };
      self.modalHistory = {
        ...self.modalHistory,
        [self.activeView]: modalsHistory,
      };
    },
  }));
