import { FC, useContext } from "react";
import { observer } from "mobx-react-lite";
import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";

import { AppLayout } from "./AppLayout";
import { appStore } from "./features/stores/app-store";
import { useQuery } from "react-query";
import { UsersAPI } from "./features/utils/requests/user-request";

export const App: FC = observer(({ children }) => {
  const { colorSchema, setUser, appParams } = useContext(appStore);

  useQuery({
    queryKey: ["user-me"],
    queryFn: UsersAPI.getMeData,
    retry: 1,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    onSuccess: setUser,
    enabled: !!appParams,
  });

  return (
    <ConfigProvider scheme={colorSchema}>
      <AdaptivityProvider>
        <AppRoot mode="full">
          <AppLayout>{children}</AppLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
});
