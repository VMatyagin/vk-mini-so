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
import { EventParticipantsPanel } from "./features/event/pages/EventParticipantsPanel";
import { EventQuotasPanel } from "./features/event/pages/EventQuotasPanel";
import { CompetitionsListPanel } from "./features/event/pages/CompetitionsListPanel";
import { CompetitionEditPanel } from "./features/event/pages/CompetitionEditPanel";
import { CompetitionViewPanel } from "./features/event/pages/CompetitionViewPanel";
import { CompetitionParticipantListPanel } from "./features/event/pages/CompetitionParticipantListPanel";
import { NomiantionsListPanel } from "./features/event/pages/NomiantionsListPanel";
import { ShtabViewPanel } from "./features/shtab/pages/ShtabViewPanel";
import { ShtabListPanel } from "./features/shtab/pages/ShtabListPanel";
import { ShtabEditPanel } from "./features/shtab/pages/ShtabEditPanel";
import { BrigadeListPanel } from "./features/brigades/pages/BrigadeListPanel";
import { BrigadeViewPanel } from "./features/brigades/pages/BrigadeViewPanel";
import { BrigadeEditPanel } from "./features/brigades/pages/BrigadeEditPanel";
import { BoecViewPanel } from "./features/boec/pages/BoecViewPanel";
import { BoecEditPanel } from "./features/boec/pages/BoecEditPanel";
import { BoecListPanel } from "./features/boec/pages/BoecListPanel";
import { BoecHistoryPanel } from "./features/boec/pages/BoecHistoryPanel";
import { BoecSeasonPanel } from "./features/boec/pages/BoecSeasonPanel";
import { PollViewPanel } from "./features/polls/pages/PollViewPanel";
import { BrigadeReportsListPanel } from "./features/brigades/pages/BrigadeReportsListPanel";
import { ReportViewPanel } from "./features/report/pages/ReportViewPanel";
import { ReportEditPanel } from "./features/report/pages/ReportEditPanel";
import { ReportBoecListPanel } from "./features/report/pages/ReportBoecListPanel";
import { BrigadeSeasonRequestsPanel } from "./features/brigades/pages/BrigadeSeasonRequestsPanel";

export const AppLayout: FC = observer(() => {
  const { popout } = useContext(routerStore);

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
              {/* else will throw error */}
              {/* {user?.brigades?.length ? (
                <EventBrigadeParticipantsPanel nav="brigade-participants" />
              ) : undefined} */}
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
              <CompetitionParticipantListPanel nav="participants" worth={0} />
              <CompetitionParticipantListPanel nav="involvements" worth={1} />
              <CompetitionParticipantListPanel nav="winners" worth={2} />
              <CompetitionParticipantListPanel nav="not-winners" worth={3} />

              <NomiantionsListPanel nav="nominations" />
            </View>
            <View
              activePanel={getElseViewPanel("shtabs", location[2], "base")}
              nav="shtabs"
            >
              <ShtabListPanel nav="base" />
            </View>
            <View
              activePanel={getElseViewPanel("shtab", location[2], "details")}
              nav="shtab"
            >
              <ShtabViewPanel nav="details" />
              <ShtabEditPanel nav="edit" />
            </View>
            <View
              activePanel={getElseViewPanel("reports", location[2], "base")}
              nav="reports"
            >
              {/* <EventListPanel nav="base" /> */}
              <ReportEditPanel nav="create" />
            </View>
            <View
              activePanel={getElseViewPanel("report", location[2], "details")}
              nav="report"
            >
              <ReportViewPanel nav="details" />
              <ReportEditPanel nav="edit" />
              <ReportBoecListPanel nav="boec-list" />
            </View>
            <View
              activePanel={getElseViewPanel("brigades", location[2], "base")}
              nav="brigades"
            >
              <BrigadeListPanel nav="base" />
            </View>
            <View
              activePanel={getElseViewPanel("brigade", location[2], "details")}
              nav="brigade"
            >
              <BrigadeViewPanel nav="details" />
              <BrigadeEditPanel nav="edit" />
              <BrigadeReportsListPanel nav="seasons-list" />
              <BrigadeSeasonRequestsPanel nav="seasons-requests-list" />
            </View>
            <View
              activePanel={getElseViewPanel("boecs", location[2], "base")}
              nav="boecs"
            >
              <BoecListPanel nav="base" />
              <BoecEditPanel nav="create" />
            </View>
            <View
              activePanel={getElseViewPanel("boec", location[2], "details")}
              nav="boec"
            >
              <BoecViewPanel nav="details" />
              <BoecEditPanel nav="edit" />
              <BoecSeasonPanel nav="seasons" />
              <BoecHistoryPanel nav="history" />
            </View>
            <View
              activePanel={getElseViewPanel("poll", location[2], "base")}
              nav="poll"
            >
              <PollViewPanel nav="base" />
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
