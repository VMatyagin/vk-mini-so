import { FC, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
    Epic,
    usePlatform,
    useAdaptivity,
    ViewWidth,
    VKCOM,
    SplitCol,
    SplitLayout,
    PanelHeader,
    Root,
} from "@vkontakte/vkui";

import { routerStore } from "./features/stores/router-store";
import { DesktopMenu } from "./ui/molecules/DesktopMenu";
import { MobileMenu } from "./ui/molecules/MobileMenu";
import { Modals } from "./ui/organisms/Modals";
import { toJS } from "mobx";
import { BoecView } from "./features/boec/template/BoecView";
import { BrigadesView } from "./features/brigades/template/BrigadesView";
import { ElseView } from "./features/else/pages/ElseView";
import { EventView } from "./features/event/template/EventView";
import { ShtabView } from "./features/shtab/template/ShtabView";
import { ProfileView } from "./features/profile/template/ProfileView";
import { ScannerView } from "./features/scanner/template/ScannerView";

export const AppLayout: FC = observer(() => {
    const {
        setLastAndroidBackAction,
        lastAndroidBackAction,
        goBack,
        activeStory,
        activeView,
        popout,
        pageScrollPosition,
    } = useContext(routerStore);
    const router = useContext(routerStore);
    console.log(toJS(router));
    useEffect(() => {
        const popListener = () => {
            let timeNow = +new Date();
            if (timeNow - lastAndroidBackAction > 500) {
                setLastAndroidBackAction(timeNow);
                goBack();
            } else {
                window.history.pushState(null, "");
            }
        };
        window.addEventListener("popstate", popListener);
        return () => {
            window.removeEventListener("popstate", popListener);
        };
    }, [goBack, lastAndroidBackAction, setLastAndroidBackAction]);

    useEffect(() => {
        window.scroll(0, pageScrollPosition);
    }, [pageScrollPosition]);

    const platform = usePlatform();
    const { viewWidth = 3 } = useAdaptivity();

    const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET;
    const hasHeader = platform !== VKCOM;

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
                <Epic
                    activeStory={activeStory}
                    tabbar={!isDesktop && <MobileMenu />}
                >
                    <Root id="else" activeView={activeView}>
                        <ElseView id="else" />
                        <EventView id="event" />
                        <BrigadesView id="brigades" />
                        <BoecView id="boec" />
                        <ShtabView id="shtab" />
                    </Root>
                    <Root id="profile" activeView={activeView}>
                        <ProfileView id="profile" />
                    </Root>
                    <Root id="scanner" activeView={activeView}>
                        <ScannerView id="scanner" />
                    </Root>
                </Epic>
            </SplitCol>
            {isDesktop && <DesktopMenu />}
        </SplitLayout>
    );
});
