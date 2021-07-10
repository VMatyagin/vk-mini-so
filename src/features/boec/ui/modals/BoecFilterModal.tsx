import { Icon24Done } from "@vkontakte/icons";
import {
    ModalPage,
    ModalPageHeader,
    PanelHeaderClose,
    PanelHeaderButton,
    IOS,
    Spinner,
    Group,
    FormItem,
    Select,
    CustomSelectOption,
    ViewWidth,
    useAdaptivity,
    usePlatform,
} from "@vkontakte/vkui";
import { useState } from "react";
import { useQuery } from "react-query";
import { RouterStoreInstance } from "../../../stores/router-store";
import { BrigadesAPI } from "../../../utils/requests/brigades-request";

export const MODAL_BOEC_FILTER = "MODAL_BOEC_FILTER";

export const BoecFilterModal = () => {
    const { activeModal, closeModal, modalCallback } = RouterStoreInstance;
    const [selectedBrigade, setBrigade] = useState<string>();

    const platform = usePlatform();
    const { viewWidth = 100 } = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;

    const { data: brigadesList } = useQuery({
        queryKey: ["brigades"],
        queryFn: () => BrigadesAPI.getBrigadesList({ limit: 1000 }),
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: activeModal === MODAL_BOEC_FILTER,
    });
    return (
        <ModalPage
            id={MODAL_BOEC_FILTER}
            settlingHeight={100}
            header={
                <ModalPageHeader
                    left={isMobile && <PanelHeaderClose onClick={closeModal} />}
                    right={
                        <PanelHeaderButton
                            onClick={() => {
                                modalCallback[MODAL_BOEC_FILTER](
                                    selectedBrigade
                                );
                                setBrigade(undefined);
                            }}
                        >
                            {platform === IOS ? "Готово" : <Icon24Done />}
                        </PanelHeaderButton>
                    }
                >
                    Фильтры
                </ModalPageHeader>
            }
            onClose={closeModal}
        >
            {!brigadesList && (
                <Spinner size="small" style={{ margin: "20px 0" }} />
            )}
            {brigadesList && (
                <Group style={{ minHeight: 300 }}>
                    <FormItem top="Отряд">
                        <Select
                            placeholder="Не выбран"
                            value={selectedBrigade}
                            options={brigadesList.items.map((user) => ({
                                label: user.title,
                                value: user.id,
                            }))}
                            onChange={(e) => {
                                setBrigade(e.target.value);
                            }}
                            renderOption={({ option, ...restProps }) => (
                                <CustomSelectOption {...restProps} />
                            )}
                        />
                    </FormItem>
                </Group>
            )}
        </ModalPage>
    );
};
