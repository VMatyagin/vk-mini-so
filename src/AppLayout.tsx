import { FC, useContext, useMemo } from "react";
import { observer } from "mobx-react-lite";
import {
  usePlatform,
  useAdaptivity,
  ViewWidth,
  VKCOM,
  SplitCol,
  SplitLayout,
  PanelHeader,
  Epic,
  Root,
  View,
} from "@vkontakte/vkui";

import { DesktopMenu } from "./ui/molecules/DesktopMenu";
import { Modals } from "./ui/organisms/Modals";
import { routerStore } from "./features/stores/router-store";

import { useRoute } from "react-router5";
import { ElsePanel } from "./features/else/pages/ElsePanel";
import { EventListPanel } from "./features/event/pages/EventListPanel";
import { NotificationsPanel } from "./features/profile/pages/NotificationsPanel";
import { ProfilePanel } from "./features/profile/pages/ProfilePanel";
import { ScannerPanel } from "./features/scanner/pages/ScannerPanel";
import { ScanPanel } from "./features/scanner/pages/ScanPanel";
import { MobileMenu } from "./ui/molecules/MobileMenu";
import { getElseViewPanel } from "./routes";
import { EventViewPanel } from "./features/event/pages/EventViewPanel";
import { EventEditPanel } from "./features/event/pages/EventEditPanel";
import { EventBrigadeParticipantsPanel } from "./features/event/pages/EventBrigadeParticipantsPanel";
import { appStore } from "./features/stores/app-store";
import { EventParticipantsPanel } from "./features/event/pages/EventParticipantsPanel";
import { EventQuotasPanel } from "./features/event/pages/EventQuotasPanel";
import { CompetitionsListPanel } from "./features/event/pages/CompetitionsListPanel";
import { CompetitionEditPanel } from "./features/event/pages/CompetitionEditPanel";
import { CompetitionViewPanel } from "./features/event/pages/CompetitionViewPanel";
import { CompetitionParticipantListPanel } from "./features/event/pages/CompetitionParticipantListPanel";
import { NomiantionsListPanel } from "./features/event/pages/NomiantionsListPanel";

export const AppLayout: FC = observer(() => {
  const { popout } = useContext(routerStore);
  const { user } = useContext(appStore);

  const platform = usePlatform();
  const { viewWidth = 3 } = useAdaptivity();
  const { route } = useRoute();
  const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET;
  const hasHeader = platform !== VKCOM;
  const location = useMemo(() => route.name.split("."), [route.name]);

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
        <Epic activeStory={location[0]} tabbar={!isDesktop && <MobileMenu />}>
          <Root nav="else" activeView={location[1]}>
            <View
              activePanel={getElseViewPanel("base", location[2], "base")}
              nav="base"
            >
              <ElsePanel nav="base" />
            </View>
            <View
              activePanel={getElseViewPanel("events", location[2], "base")}
              nav="events"
            >
              <EventListPanel nav="base" />
              <EventEditPanel nav="create" />
            </View>
            <View
              activePanel={getElseViewPanel("event", location[2], "details")}
              nav="event"
            >
              <EventViewPanel nav="details" />
              <EventEditPanel nav="edit" />
              {user?.brigades?.length && (
                <EventBrigadeParticipantsPanel nav="brigade-participants" />
              )}
              <EventParticipantsPanel nav="volonteers" worth={1} />
              <EventParticipantsPanel nav="organizers" worth={2} />
              <EventParticipantsPanel nav="participants" worth={0} />
              <EventQuotasPanel nav="quotas" />
            </View>
            <View
              activePanel={getElseViewPanel(
                "competitions",
                location[2],
                "base"
              )}
              nav="competitions"
            >
              <CompetitionsListPanel nav="base" />
              <CompetitionEditPanel nav="create" />
            </View>
            <View
              activePanel={getElseViewPanel(
                "competition",
                location[2],
                "details"
              )}
              nav="competition"
            >
              <CompetitionViewPanel nav="details" />
              <CompetitionEditPanel nav="edit" />
              <CompetitionParticipantListPanel id="participants" worth={0} />
              <CompetitionParticipantListPanel id="involvements" worth={1} />
              <CompetitionParticipantListPanel id="winners" worth={2} />
              <CompetitionParticipantListPanel id="not-winners" worth={3} />

              <NomiantionsListPanel id="nominations" />
            </View>
          </Root>
          <Root nav="scanner" activeView="base">
            <View nav="base" activePanel={location[1] ?? "base"}>
              <ScannerPanel nav="base" />
              <ScanPanel nav="scan" />
            </View>
          </Root>
          <Root nav="profile" activeView={location[1] ?? "base"}>
            <View activePanel="base" nav="base">
              <ProfilePanel nav="base" />
            </View>
            <View activePanel="base" nav="notifications">
              <NotificationsPanel nav="base" />
            </View>
          </Root>
        </Epic>
      </SplitCol>
      {isDesktop && <DesktopMenu />}
    </SplitLayout>
  );
});
