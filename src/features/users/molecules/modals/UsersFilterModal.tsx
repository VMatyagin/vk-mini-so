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
import React, { FC, useCallback, useEffect, useState } from "react";
import { Icon24Cancel, Icon24Done } from "@vkontakte/icons";

import { useFetch } from "../../../utils/useFetch";
import { SoAPI } from "../../../utils/api.service";
import { Brigade } from "../../../types";
import { ListResponse } from "../../../utils/types";
interface CalendarInfoModalComponentProps {
    id: string;
    onClose: (id?: string) => void;
}
export const UsersFilterModal: FC<CalendarInfoModalComponentProps> = withModalRootContext(
    ({ id, onClose }) => {
        const [selectedBrigade, setBrigade] = useState<string>();
        const [brigadeList, setBrigades] = useState<Brigade[]>([]);
        const onLoad = useCallback((data: ListResponse<Brigade>) => {
            setBrigades(data.items);
        }, []);
        const { fetch } = useFetch(SoAPI.getBrigadesList, onLoad);

        useEffect(() => {
            fetch();
        }, [fetch]);
        const platform = usePlatform();
        const { viewWidth = 100 } = useAdaptivity();

        const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET;

        const close = () => onClose();

        return (
            <ModalPage
                id={id}
                dynamicContentHeight={true}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        left={
                            platform === ANDROID && (
                                <PanelHeaderButton onClick={close}>
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
                onClose={close}
            >
                <Group
                    style={{
                        minHeight: isDesktop ? 250 : undefined,
                    }}
                >
                    <FormItem top="Отряд">
                        <Select
                            placeholder="Не выбран"
                            options={brigadeList.map((user) => ({
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
            </ModalPage>
        );
    }
);
