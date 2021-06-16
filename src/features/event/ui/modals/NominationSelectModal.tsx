import { Icon24Done } from "@vkontakte/icons";
import {
    ModalPage,
    ModalPageHeader,
    PanelHeaderClose,
    PanelHeaderButton,
    IOS,
    Group,
    FormItem,
    ViewWidth,
    useAdaptivity,
    usePlatform,
} from "@vkontakte/vkui";
import { useState } from "react";
import { LazySelect } from "../../../../ui/organisms/LazySelect";
import { RouterStoreInstance } from "../../../stores/router-store";
import { Nomination } from "../../../types";
import { EventAPI } from "../../../utils/requests/event-request";
import { EventStoreInstance } from "../../store/eventStore";

export const MODAL_EVENT_NOMINATION_SELECT = "MODAL_EVENT_NOMINATION_SELECT";

export const NominationSelectModal = () => {
    const { closeModal, modalCallback } = RouterStoreInstance;
    const { competitionId } = EventStoreInstance;
    const [selectedNomination, setNomination] = useState<number>();

    const platform = usePlatform();
    const { viewWidth = 100 } = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;

    const onSelectNominationClose = () => {
        closeModal();
        setNomination(undefined);
    };

    const onNominationSelect = () => {
        modalCallback[MODAL_EVENT_NOMINATION_SELECT](selectedNomination);
        setNomination(undefined);
        closeModal();
    };
    return (
        <ModalPage
            id={MODAL_EVENT_NOMINATION_SELECT}
            settlingHeight={100}
            header={
                <ModalPageHeader
                    left={
                        isMobile && (
                            <PanelHeaderClose
                                onClick={onSelectNominationClose}
                            />
                        )
                    }
                    right={
                        selectedNomination && (
                            <PanelHeaderButton onClick={onNominationSelect}>
                                {platform === IOS ? "Готово" : <Icon24Done />}
                            </PanelHeaderButton>
                        )
                    }
                >
                    Выбор номинации
                </ModalPageHeader>
            }
            onClose={onSelectNominationClose}
        >
            <Group style={{ minHeight: 300 }}>
                <FormItem top="Номинация">
                    <LazySelect
                        name={"nominations"}
                        onChange={(value) =>
                            setNomination(Number(value.target.value))
                        }
                        value={selectedNomination}
                        fetchFn={EventAPI.getCompetitionNominations}
                        extraFnProp={{ competitionId }}
                        queryKey={`nominations-${competitionId}`}
                        parseItem={(nomination: Nomination) => ({
                            label: nomination.title,
                            value: nomination.id,
                        })}
                    />
                </FormItem>
            </Group>
        </ModalPage>
    );
};
