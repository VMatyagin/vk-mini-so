import { FC, useContext } from "react";
import { observer } from "mobx-react-lite";
import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";

import { AppLayout } from "./AppLayout";
import { appStore } from "./features/stores/app-store";
import { useQuery } from "react-query";
import { IntroPanel } from "./ui/pages/IntroPanel";

export const App: FC = observer(({ children }) => {
  const { colorSchema, getMe, appParams, isInitialization } =
    useContext(appStore);

  useQuery({
    queryKey: ["user-me"],
    queryFn: getMe,
    retry: 1,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    enabled: !!appParams,
  });

  return (
    <ConfigProvider scheme={colorSchema}>
      <AdaptivityProvider>
        <AppRoot mode="full">
          {isInitialization ? (
            <IntroPanel />
          ) : (
            <AppLayout>{children}</AppLayout>
          )}
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
});
