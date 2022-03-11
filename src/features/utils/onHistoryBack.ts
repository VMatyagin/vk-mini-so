import { State } from "router5";
import { router } from "../..";

export const onHistoryBack = (previousRoute: State | null) => () => {
  if (previousRoute !== null) {
    window.history.back();
  } else {
    router.navigateToDefault();
  }
};
