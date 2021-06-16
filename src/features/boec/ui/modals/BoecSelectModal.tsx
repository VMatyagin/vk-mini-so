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
import { Boec } from "../../../types";
import { MODAL_BOEC_LIST } from "./BoecListModal";

export const MODAL_BOEC_SELECTING = "MODAL_BOEC_SELECTING";

export const BoecSelectModal = () => {
    const { closeModal, modalCallback, setModalCallback, openModal } =
        RouterStoreInstance;
    const [boecs, setBoecs] = useState<Boec[]>([]);

    const onBoecSelecting = () => {
        modalCallback[MODAL_BOEC_SELECTING](boecs);
        closeModal();
        setBoecs([]);
    };
    const onBoecSelectingClose = () => {
        closeModal();
        setBoecs([]);
    };
    const openBoecListModal = () => {
        setModalCallback(MODAL_BOEC_LIST, (boec: Boec) => {
            setBoecs((prev) => {
                if (prev.includes(boec)) {
                    return prev;
                } else {
                    return [...prev, boec];
                }
            });
            closeModal();
        });
        openModal(MODAL_BOEC_LIST);
    };
    const handleRemove = (boec: Boec) => {
        setBoecs((prev) => prev.filter((item) => item !== boec));
    };

    const platform = usePlatform();
    const { viewWidth = 100 } = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;

    return (
        <ModalPage
            id={MODAL_BOEC_SELECTING}
            settlingHeight={100}
            header={
                <ModalPageHeader
                    left={
                        isMobile && (
                            <PanelHeaderClose onClick={onBoecSelectingClose} />
                        )
                    }
                    right={
                        boecs.length > 0 && (
                            <PanelHeaderButton onClick={onBoecSelecting}>
                                {platform === IOS ? "Готово" : <Icon24Done />}
                            </PanelHeaderButton>
                        )
                    }
                >
                    Выбор бойцов
                </ModalPageHeader>
            }
            onClose={onBoecSelectingClose}
        >
            <Group>
                <CellButton onClick={openBoecListModal}>Выбрать</CellButton>
            </Group>
            <Group header={<Header mode="secondary">Выбрано</Header>}>
                {boecs.length === 0 ? (
                    <Footer>Ничего не выбрано</Footer>
                ) : (
                    boecs.map((boec) => (
                        <Cell
                            removable={true}
                            onRemove={() => handleRemove(boec)}
                            key={boec.id}
                        >
                            {boec.fullName}
                        </Cell>
                    ))
                )}
            </Group>
        </ModalPage>
    );
};
