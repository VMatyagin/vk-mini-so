import { Icon24Done } from "@vkontakte/icons";
import {
    ModalPage,
    ModalPageHeader,
    PanelHeaderClose,
    PanelHeaderButton,
    IOS,
    Group,
    FormItem,
    Select,
    CustomSelectOption,
    ViewWidth,
    useAdaptivity,
    usePlatform,
} from "@vkontakte/vkui";
import { useState } from "react";
import { positions } from "../../../brigades/helpers";
import { RouterStoreInstance } from "../../../stores/router-store";

export const MODAL_BOEC_POSITION_SELECT = "MODAL_BOEC_POSITION_SELECT";

export const LeaderPositionModal = () => {
    const { closeModal, modalCallback, closeModalStack } = RouterStoreInstance;
    const [selectedPosition, setPosition] = useState<string>();

    const onPositionSelect = () => {
        modalCallback[MODAL_BOEC_POSITION_SELECT](selectedPosition);
        closeModalStack();
        setPosition(undefined);
    };

    const onSelectPositionClose = () => {
        closeModal();
        setPosition(undefined);
    };
    const platform = usePlatform();
    const { viewWidth = 100 } = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;

    return (
        <ModalPage
            id={MODAL_BOEC_POSITION_SELECT}
            settlingHeight={100}
            header={
                <ModalPageHeader
                    left={
                        isMobile && (
                            <PanelHeaderClose onClick={onSelectPositionClose} />
                        )
                    }
                    right={
                        selectedPosition && (
                            <PanelHeaderButton onClick={onPositionSelect}>
                                {platform === IOS ? "Готово" : <Icon24Done />}
                            </PanelHeaderButton>
                        )
                    }
                >
                    Выбор должности
                </ModalPageHeader>
            }
            onClose={onSelectPositionClose}
        >
            <Group style={{ minHeight: 300 }}>
                <FormItem top="Должность">
                    <Select
                        placeholder="Не выбран"
                        value={selectedPosition}
                        options={positions.map((position, index) => ({
                            label: position.title,
                            value: index,
                        }))}
                        onChange={(e) => {
                            setPosition(e.target.value);
                        }}
                        renderOption={({ option, ...restProps }) => (
                            <CustomSelectOption {...restProps} />
                        )}
                    />
                </FormItem>
            </Group>
        </ModalPage>
    );
};
