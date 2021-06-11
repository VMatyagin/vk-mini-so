import {
    ModalPage,
    ModalPageHeader,
    usePlatform,
    IOS,
    PanelHeaderButton,
    Group,
    FormItem,
    Select,
    CustomSelectOption,
    withModalRootContext,
    useAdaptivity,
    ViewWidth,
    PanelHeaderClose,
    Spinner,
} from "@vkontakte/vkui";
import { FC, useContext, useEffect, useState } from "react";
import { Icon24Done } from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../../../stores/router-store";
import { useQuery } from "react-query";
import { BrigadesAPI } from "../../../../utils/requests/brigades-request";

interface CalendarInfoModalComponentProps {
    id: string;
    updateModalHeight?: () => void;
}
export const UsersFilterModal: FC<CalendarInfoModalComponentProps> =
    withModalRootContext(
        observer(({ id, updateModalHeight }) => {
            const { closeModal, modalCallback } = useContext(routerStore);
            useEffect(() => {
                updateModalHeight!();
            }, [updateModalHeight]);
            const [selectedBrigade, setBrigade] = useState<string>();

            const { data } = useQuery({
                queryKey: ["brigades"],
                queryFn: () => BrigadesAPI.getBrigadesList({ limit: 200 }),
                retry: 1,
                refetchOnWindowFocus: false,
            });

            const platform = usePlatform();
            const { viewWidth = 100 } = useAdaptivity();
            const isMobile = viewWidth <= ViewWidth.MOBILE;

            return (
                <ModalPage
                    id={id}
                    settlingHeight={100}
                    header={
                        <ModalPageHeader
                            left={
                                isMobile && (
                                    <PanelHeaderClose onClick={closeModal} />
                                )
                            }
                            right={
                                <PanelHeaderButton
                                    onClick={() =>
                                        modalCallback[id](selectedBrigade)
                                    }
                                >
                                    {platform === IOS ? (
                                        "Готово"
                                    ) : (
                                        <Icon24Done />
                                    )}
                                </PanelHeaderButton>
                            }
                        >
                            Фильтры
                        </ModalPageHeader>
                    }
                    onClose={closeModal}
                >
                    {!data && (
                        <Spinner
                            size="small"
                            style={{ margin: "20px 0", height: 300 }}
                        />
                    )}
                    {data && (
                        <Group style={{ height: 300 }}>
                            <FormItem top="Отряд">
                                <Select
                                    placeholder="Не выбран"
                                    value={selectedBrigade}
                                    options={data.items.map((user) => ({
                                        label: user.title,
                                        value: user.id,
                                    }))}
                                    onChange={(e) => {
                                        setBrigade(e.target.value);
                                    }}
                                    renderOption={({
                                        option,
                                        ...restProps
                                    }) => <CustomSelectOption {...restProps} />}
                                />
                            </FormItem>
                        </Group>
                    )}
                </ModalPage>
            );
        })
    );
