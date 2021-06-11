import { Root } from "@vkontakte/vkui";
import { EventHandlingView } from "../event/EventHandlingView";
import { RatingView } from "../rating/RatingView";
import { ElseView } from "./pages/ElseView";
import { BrigadesView } from "../brigades/template/BrigadesView";
import { BoecView } from "../boec/template/BoecView";
import { ShtabView } from "../shtab/template/ShtabView";

export const elseRoutes = (activeView: string) => (
    <Root id="else" activeView={activeView}>
        <ElseView id="else" />
        <EventHandlingView id="else_event_handle" />
        <RatingView id="else_rating" />
        <BrigadesView id="brigades" />
        <BoecView id="boec" />
        <ShtabView id="shtab" />
    </Root>
);
