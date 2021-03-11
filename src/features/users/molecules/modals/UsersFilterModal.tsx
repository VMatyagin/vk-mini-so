import {
    ModalPage,
    ModalPageHeader,
    usePlatform,
    ANDROID,
    IOS,
    PanelHeaderButton,
    Group,
    FormItem,
    Select,
    CustomSelectOption,
    withModalRootContext,
    useAdaptivity,
    ViewWidth,
} from "@vkontakte/vkui";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { Icon24Cancel, Icon24Done } from "@vkontakte/icons";

import { useFetch } from "../../../utils/useFetch";
import { SoAPI } from "../../../utils/api.service";
import { Brigade } from "../../../types";
import { ListResponse } from "../../../utils/types";
import {
    ModalContext,
    ModelContextInstance,
} from "../../../../ui/molecules/AbstractView";

interface CalendarInfoModalComponentProps {
    id: string;
}
export const UsersFilterModal: FC<CalendarInfoModalComponentProps> = withModalRootContext(
    ({ id }) => {
        const [selectedBrigade, setBrigade] = useState<string>();
        const [brigadeList, setBrigades] = useState<Brigade[]>([]);
        const onLoad = useCallback((data: ListResponse<Brigade>) => {
            setBrigades(data.items);
        }, []);
        const { fetch } = useFetch(SoAPI.getBrigadesList, onLoad);
        const { onClose } = useContext<
            ModelContextInstance<(id?: string) => void>
        >(ModalContext);

        useEffect(() => {
            fetch();
        }, [fetch]);
        const platform = usePlatform();
        const { viewWidth = 100 } = useAdaptivity();

        const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET;

        return (
            <ModalPage
                id={id}
                dynamicContentHeight={true}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        left={
                            platform === ANDROID && (
                                <PanelHeaderButton onClick={() => onClose()}>
                                    <Icon24Cancel />
                                </PanelHeaderButton>
                            )
                        }
                        right={
                            <PanelHeaderButton
                                onClick={() => onClose(selectedBrigade)}
                            >
                                {platform === IOS ? "Готово" : <Icon24Done />}
                            </PanelHeaderButton>
                        }
                    >
                        Фильтры
                    </ModalPageHeader>
                }
                onClose={onClose}
            >
                <Group
                    style={{
                        minHeight: isDesktop ? 250 : undefined,
                    }}
                >
                    <FormItem top="Отряд">
                        <Select
                            placeholder="Не выбран"
                            value={selectedBrigade}
                            options={brigadeList.map((user) => ({
                                label: user.title,
                                value: user.id.toString(),
                            }))}
                            onChange={(e) => {
                                console.log(e.target.value);
                                
                                setBrigade(e.target.value);
                            }}
                            renderOption={({ option, ...restProps }) => (
                                <CustomSelectOption {...restProps} />
                            )}
                        />
                    </FormItem>
                </Group>
            </ModalPage>
        );
    }
);
