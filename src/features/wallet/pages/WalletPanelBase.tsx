import React, { FC, useState, useEffect } from "react";
import { PanelTemplate } from "../../../ui/panels/template/PanelTemplate";
import {  Tabs, TabsItem } from "@vkontakte/vkui";
import {
    PanelHeader,
    Title,
} from "@vkontakte/vkui";
import { useMst } from "../../stores";
import { EventCard } from "../../../ui/molecules/EventCard";
import { observer } from "mobx-react";
import { restoreScrollPosition } from "../../utils";

export const WalletPanelBase: FC<{ id: string }> = observer(({ id }) => {
    const [activeTab, setActiveTab] = useState<string>("base");
    const store = useMst();

    useEffect(() => {
        restoreScrollPosition();
        return () => {
            store.app.setActiveTab("wallet", activeTab);
        };
    }, [store.app, activeTab]);

    const handleEventClick = () => {
        store.router.openModal("MODAL_WALLET_QR");
    };
    return (
        <PanelTemplate id={id}>
            <PanelHeader separator={false}>
                <Title level="2" weight="bold">
                    Билеты
                </Title>
            </PanelHeader>
            <Tabs>
                <TabsItem
                    onClick={() => setActiveTab("base")}
                    selected={activeTab === "base"}
                >
                    Актуальное
                </TabsItem>
                <TabsItem
                    onClick={() => setActiveTab("base2")}
                    selected={activeTab === "base2"}
                >
                    Прошедшее
                </TabsItem>
            </Tabs>
            <EventCard onClick={handleEventClick} />
        </PanelTemplate>
    );
});
