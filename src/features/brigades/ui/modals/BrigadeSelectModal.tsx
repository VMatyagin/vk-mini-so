import { Icon24Done } from "@vkontakte/icons";
import {
    ModalPage,
    ModalPageHeader,
    PanelHeaderClose,
    PanelHeaderButton,
    IOS,
    Group,
    ViewWidth,
    useAdaptivity,
    usePlatform,
    Cell,
    CellButton,
    Footer,
    Header,
} from "@vkontakte/vkui";
import { useState } from "react";
import { RouterStoreInstance } from "../../../stores/router-store";
import { Brigade } from "../../../types";
import { MODAL_BRIGADE_LIST } from "./BrigadeListModal";

export const MODAL_BRIGADE_SELECTING = "MODAL_BRIGADE_SELECTING";

export const BrigadeSelectModal = () => {
    const { closeModal, modalCallback, setModalCallback, openModal } =
        RouterStoreInstance;
    const [brigades, setBrigades] = useState<Brigade[]>([]);

    const onBoecSelecting = () => {
        modalCallback[MODAL_BRIGADE_SELECTING](brigades);
        closeModal();
        setBrigades([]);
    };
    const onBrigadeSelectingClose = () => {
        closeModal();
        setBrigades([]);
    };
    const openBrigadeListModal = () => {
        setModalCallback(MODAL_BRIGADE_LIST, (brigade: Brigade) => {
            setBrigades((prev) => {
                if (prev.includes(brigade)) {
                    return prev;
                } else {
                    return [...prev, brigade];
                }
            });
            closeModal();
        });
        openModal(MODAL_BRIGADE_LIST);
    };
    const handleRemove = (brigade: Brigade) => {
        setBrigades((prev) => prev.filter((item) => item !== brigade));
    };

    const platform = usePlatform();
    const { viewWidth = 100 } = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;

    return (
        <ModalPage
            id={MODAL_BRIGADE_SELECTING}
            settlingHeight={100}
            header={
                <ModalPageHeader
                    left={
                        isMobile && (
                            <PanelHeaderClose
                                onClick={onBrigadeSelectingClose}
                            />
                        )
                    }
                    right={
                        <PanelHeaderButton onClick={onBoecSelecting}>
                            {platform === IOS ? "Готово" : <Icon24Done />}
                        </PanelHeaderButton>
                    }
                >
                    Выбор отряда
                </ModalPageHeader>
            }
            onClose={onBrigadeSelectingClose}
        >
            <Group>
                <CellButton onClick={openBrigadeListModal}>Выбрать</CellButton>
                <Footer>
                    Если не выбрать, то подтянется из последнего сезона бойцов
                </Footer>
            </Group>
            <Group header={<Header mode="secondary">Выбрано</Header>}>
                {brigades.length === 0 ? (
                    <Footer>Ничего не выбрано</Footer>
                ) : (
                    brigades.map((brigade) => (
                        <Cell
                            removable={true}
                            onRemove={() => handleRemove(brigade)}
                            key={brigade.id}
                        >
                            {brigade.title}
                        </Cell>
                    ))
                )}
            </Group>
        </ModalPage>
    );
};
