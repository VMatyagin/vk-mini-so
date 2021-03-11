import {
    FC,
} from "react";
import {
    Group,
    ModalRoot,
    Panel,
    SimpleCell,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { useMst } from "../../stores";
import { UsersFilterModal } from "../molecules/modals/UsersFilterModal";
import { observer } from "mobx-react";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { LazyUsersList } from "../LazyUsersList";

export const UsersListView: FC<{ id: string }> = observer(({ id }) => {
    const store = useMst();

    let activeModal =
        store.router.activeModals[id] === undefined
            ? null
            : store.router.activeModals[id];

    const modals = (
        <ModalRoot activeModal={activeModal} onClose={store.router.closeModal}>
            <UsersFilterModal id="MODAL_USERS_LIST" />
        </ModalRoot>
    );

    const changeView = (id: string) => {
        store.router.setPage("user", "base");
        store.boec.fetchBoec(id);
    };

    return (
        <AbstractView id={id} modal={modals}>
            <Panel id="base">
                <PanelHeader>
                    <Title level="2" weight="bold">
                        Люди
                    </Title>
                </PanelHeader>
                <Group>
                    <LazyUsersList
                        renderItem={(item) => (
                            <SimpleCell
                                key={item.id}
                                onClick={() => changeView(item.id.toString())}
                            >
                                {item.fullName}
                            </SimpleCell>
                        )}
                    />
                </Group>
            </Panel>
        </AbstractView>
    );
});
