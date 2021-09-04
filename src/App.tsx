import { FC, useContext } from "react";
import { observer } from "mobx-react-lite";
import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";

import { AppLayout } from "./AppLayout";
import { appStore } from "./features/stores/app-store";
import { Intro } from "./ui/molecules/Intro";
import { useQuery } from "react-query";
import { UsersAPI } from "./features/utils/requests/user-request";
import { NoBoecAttached } from "./ui/molecules/NoBoecAttached";

export const App: FC = observer(({ children }) => {
  const { colorSchema, isInitialization, setUser, user } = useContext(appStore);

  useQuery({
    queryKey: ["user-me"],
    queryFn: () => UsersAPI.getMeData(),
    retry: 1,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    enabled: !isInitialization,
    onSuccess: setUser,
  });

  return (
    <ConfigProvider scheme={colorSchema}>
      <AdaptivityProvider>
        <AppRoot noLegacyClasses={true}>
          {isInitialization ? (
            <Intro />
          ) : user?.boec !== null ? (
            <AppLayout>{children}</AppLayout>
          ) : (
            <NoBoecAttached />
          )}
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
});
