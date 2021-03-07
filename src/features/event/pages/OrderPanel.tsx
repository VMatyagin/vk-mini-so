import React, { FC, useCallback, useEffect, useState } from "react";
import {
    PanelHeader,
    Title,
    PanelHeaderBack,
    Panel,
    ScreenSpinner,
    FormItem,
    Button,
    Input,
    CustomSelectOption,
    Select,
    Group,
    FormLayout,
} from "@vkontakte/vkui";

import { observer } from "mobx-react";
import { useMst } from "../../stores";
import { Controller, useForm } from "react-hook-form";
import { Brigade, EventOrder } from "../../types";
import { ListResponse } from "../../utils/types";
import { useFetch } from "../../utils/useFetch";
import { SoAPI } from "../../utils/api.service";
import { Checkbox } from "@vkontakte/vkui/dist/components/Checkbox/Checkbox";
import { dirtyValues } from "../../utils";
import { SuccessSnackbar } from "../../../ui/molecules/SuccessSnackbar";

export const OrderPanel: FC<{ id: string }> = observer(({ id }) => {
    const { router, event } = useMst();
    const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);
    const [brigadeList, setBrigades] = useState<Brigade[]>([]);
    const onLoad = useCallback((data: ListResponse<Brigade>) => {
        setBrigades(data.items);
    }, []);
    const { fetch } = useFetch(SoAPI.getBrigadesList, onLoad);
    const onBack = () => {
        router.goBack();
        event.resetOrder();
    };

    const {
        handleSubmit,
        errors,
        control,
        register,
        formState,
        reset,
    } = useForm<EventOrder>({
        defaultValues: event.eventOrder || {},
        reValidateMode: "onChange",
        mode: "onChange",
    });
    const { isDirty, isValid, dirtyFields } = formState;
    useEffect(() => {
        fetch();
    }, [fetch]);
    useEffect(() => {
        return () => {
            event.resetOrder();
        };
    }, [event]);
    const onSubmit = (values: EventOrder) => {
        router.openPopout(<ScreenSpinner />);
        const fn = event.eventOrder ? SoAPI.updateOrder : SoAPI.createOrder;
        const isNew = !!!event.eventOrder;
        fn({
            ...dirtyValues(dirtyFields, values),
            id: values.id || undefined,
            event: event.eventData!.id,
        }).then(({ data }) => {
            event.setEventOrder(data);
            router.closePopout();
            reset(data);
            setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
            isNew && event.resetOrder();
            router.goBack();
        });
    };

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={onBack} />}>
                <Title level="2" weight="bold">
                    {event.eventOrder
                        ? `Заявка ${event.eventOrder.brigade.title} ${
                              event.eventOrder.title &&
                              `- ${event.eventOrder.title}`
                          }`
                        : "Создание заявки"}
                </Title>
            </PanelHeader>
            <Group>
                <FormLayout onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" ref={register} name="id" />
                    <input type="hidden" ref={register} name="event" />
                    <Controller
                        control={control}
                        name="brigade_id"
                        rules={{ required: false }}
                        render={({ onChange, value, name }, { invalid }) => (
                            <FormItem
                                top="Отряд"
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["brigade_id"] &&
                                    errors["brigade_id"].message
                                }
                            >
                                <Select
                                    name={name}
                                    defaultValue={value}
                                    value={value}
                                    placeholder="Не выбран"
                                    options={
                                        brigadeList
                                            ? brigadeList.map((item) => ({
                                                  label: item.title,
                                                  value: item.id,
                                              }))
                                            : []
                                    }
                                    onChange={onChange}
                                    renderOption={({
                                        option,
                                        ...restProps
                                    }) => <CustomSelectOption {...restProps} />}
                                />
                            </FormItem>
                        )}
                    />
                    <Controller
                        control={control}
                        name="title"
                        render={(
                            { onChange, onBlur, value, name },
                            { invalid }
                        ) => (
                            <FormItem
                                top="Название"
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["title"] &&
                                    errors["title"].message
                                }
                            >
                                <Input
                                    type="text"
                                    name={name}
                                    value={value || ""}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                            </FormItem>
                        )}
                    />
                    <Controller
                        control={control}
                        name="isСontender"
                        rules={{ required: false }}
                        render={(
                            { onChange, onBlur, value, name },
                            { invalid }
                        ) => (
                            <FormItem
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["isСontender"] &&
                                    errors["isСontender"].message
                                }
                            >
                                <Checkbox
                                    onBlur={onBlur}
                                    checked={value}
                                    onChange={onChange}
                                    name={name}
                                >
                                    Прошел в конкурсную программу (или плей-офф)
                                </Checkbox>
                            </FormItem>
                        )}
                    />
                    <Controller
                        control={control}
                        name="place"
                        rules={{ required: false }}
                        render={({ onChange, value, name }, { invalid }) => (
                            <FormItem
                                top="Занятое место"
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["place"] &&
                                    errors["place"].message
                                }
                            >
                                <Select
                                    name={name}
                                    value={value}
                                    placeholder="Не выбран"
                                    options={[
                                        {
                                            label: "Первое",
                                            value: "1",
                                        },
                                        {
                                            label: "Второе",
                                            value: "2",
                                        },
                                        {
                                            label: "Третье",
                                            value: "3",
                                        },
                                    ]}
                                    onChange={onChange}
                                    renderOption={({
                                        option,
                                        ...restProps
                                    }) => <CustomSelectOption {...restProps} />}
                                />
                            </FormItem>
                        )}
                    />
                    <FormItem>
                        <Button
                            size="l"
                            stretched={true}
                            disabled={!isDirty || !isValid}
                        >
                            {event.eventOrder ? "Сохранить" : "Создать"}
                        </Button>
                    </FormItem>
                </FormLayout>
                {SnackBar}
            </Group>
        </Panel>
    );
});
