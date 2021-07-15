import { Root } from "@vkontakte/vkui";
import { BoecView } from "../boec/template/BoecView";

export const profileRoutes = (activeView: string) => (
    <Root id="profile" activeView={activeView}>
        <BoecView id="profile" />
    </Root>
);
