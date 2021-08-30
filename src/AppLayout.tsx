import { FC, useContext } from "react";
import { observer } from "mobx-react-lite";
import {
  usePlatform,
  useAdaptivity,
  ViewWidth,
  VKCOM,
  SplitCol,
  SplitLayout,
  PanelHeader,
} from "@vkontakte/vkui";

import { DesktopMenu } from "./ui/molecules/DesktopMenu";
import { Modals } from "./ui/organisms/Modals";
import { routerStore } from "./features/stores/router-store";

import { useRoute } from "react-router5";

export const AppLayout: FC = observer(() => {
  const { popout } = useContext(routerStore);

  const platform = usePlatform();
  const { viewWidth = 3 } = useAdaptivity();
  const { route } = useRoute();
  const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET;
  const hasHeader = platform !== VKCOM;
  // const location = useMemo(() => route.name.split("."), [route.name]);
  console.log(route);

  return (
    <SplitLayout
      modal={<Modals />}
      popout={popout}
      header={hasHeader && <PanelHeader separator={false} />}
      style={{ justifyContent: "center" }}
    >
      <SplitCol
        animate={!isDesktop}
        spaced={isDesktop}
        width={isDesktop ? "560px" : "100%"}
        maxWidth={isDesktop ? "560px" : "100%"}
      >
        {/* <Epic
                    activeStory={activeStory}
                    tabbar={!isDesktop && <MobileMenu />}
                    sizeY={SizeType.REGULAR}
                >
                    <Root nav="else" activeView={activeView}>
                        <View activePanel={activePanel} nav="base">
                            <ElsePanel nav="base" />
                        </View>
                        <View activePanel={activePanel} nav="event">
                            <EventListPanel nav="base" />
                        </View>
                    </Root>
                    <Root nav="scanner" activeView={activeView}>
                        <View nav="base" activePanel={activePanel}>
                            <ScannerPanel nav="base" />
                            <ScanPanel nav="scan" />
                        </View>
                    </Root>
                    <Root nav="profile" activeView={activeView}>
                        <View activePanel={activePanel} nav="base">
                            <ProfilePanel nav="base" />
                        </View>
                        <View activePanel={activePanel} nav="notifications">
                            <NotificationsPanel nav="base" />
                        </View>
                    </Root>
                </Epic> */}
      </SplitCol>
      {isDesktop && <DesktopMenu />}
    </SplitLayout>
  );
});
