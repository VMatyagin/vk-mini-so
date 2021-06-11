import React, { FC, useContext, useEffect, useState } from "react";
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
import "@vkontakte/vkui/dist/unstable.css";

import { observer } from "mobx-react-lite";
import { Controller, useForm } from "react-hook-form";
import { EventOrder } from "../../types";
import { SoAPI } from "../../utils/api.service";
import { Checkbox } from "@vkontakte/vkui/dist/components/Checkbox/Checkbox";
import { dirtyValues } from "../../utils";
import { SuccessSnackbar } from "../../../ui/molecules/SuccessSnackbar";
import { ChipsInputOption } from "@vkontakte/vkui/dist/components/ChipsInput/ChipsInput";
import { routerStore } from "../../stores/router-store";
import { eventStore } from "../store/eventStore";

interface FormType extends EventOrder {
    brigades_id: number[];
}

export const OrderPanel: FC<{ id: string }> = observer(({ id }) => {
    const { openPopout, closePopout, goBack } = useContext(routerStore);
    const { resetOrder, eventData, eventOrder, setEventOrder } =
        useContext(eventStore);

    const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);
    // const [, setBrigades] = useState<Brigade[]>([]);
    // const onLoad = useCallback((data: ListResponse<Brigade>) => {
    //     setBrigades(data.items);
    // }, []);
    // const { fetch } = useFetch(SoAPI.getBrigadesList, onLoad);
    const onBack = () => {
        goBack();
        resetOrder();
    };

    const [fetchedUsers] = useState<ChipsInputOption[]>([]);
    // const onUsersLoad = useCallback((data: ListResponse<Boec>) => {
    //     setFetchedUsers(
    //         data.items.map((item) => ({
    //             label: item.fullName,
    //             value: item.id,
    //         }))
    //     );
    // }, []);

    // const { fetch: getUsers, isLoading: isUsersFetching } = useFetch(
    //     SoAPI.getList as any,
    //     onUsersLoad
    // );
    // const fetchUsers = useMemo(
    //     () => debounce(getUsers || (() => undefined), 750),
    //     [getUsers]
    // );
    // const handleInput = useCallback(
    //     (event?: React.ChangeEvent<HTMLInputElement>) => {
    //         event &&
    //             event.target.value &&
    //             fetchUsers({
    //                 limit: 20,
    //                 offset: 0,
    //                 search: event.target.value,
    //             });
    //     },
    //     [fetchUsers]
    // );
    const { handleSubmit, control, formState, reset } = useForm<FormType>({
        defaultValues:
            {
                ...eventOrder,
                brigades_id: eventOrder
                    ? eventOrder.brigades.map((item) => item.id)
                    : [],
                participations: [
                    ...(eventOrder ? eventOrder.participations : []),
                ],
            } || {},
        reValidateMode: "onChange",
        mode: "onChange",
    });
    const { isDirty, isValid, dirtyFields } = formState;
    // useEffect(() => {
    //     fetch();
    // }, [fetch]);
    useEffect(() => {
        return () => {
            resetOrder();
        };
    }, [resetOrder]);
    const onSubmit = (values: EventOrder) => {
        openPopout(<ScreenSpinner />);
        const fn = eventOrder ? SoAPI.updateOrder : SoAPI.createOrder;
        const isNew = !!!eventOrder;
        fn({
            ...dirtyValues(dirtyFields, values),
            id: values.id || undefined,
            event: eventData!.id,
        }).then(({ data }) => {
            setEventOrder(data);
            closePopout();
            reset(data);
            setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
            isNew && resetOrder();
            goBack();
        });
    };
    console.log(fetchedUsers);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={onBack} />}>
                <Title level="2" weight="bold">
                    {eventOrder
                        ? `Заявка ${eventOrder.brigades.reduce(
                              (prev, cur) => (prev += ` ${cur.title}`),
                              ""
                          )}  ${eventOrder.title && `- ${eventOrder.title}`}
                    `
                        : "Создание заявки"}
                </Title>
            </PanelHeader>
            <Group>
                <FormLayout onSubmit={handleSubmit(onSubmit)}>
                    {/* <input type="hidden" ref={register} name="id" />
                    <input type="hidden" ref={register} name="event" /> */}
                    {/* <Controller
                        control={control}
                        name="participations"
                        rules={{ required: false }}
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Участники"
                                status={
                                    fieldState.invalid ? "error" : "default"
                                }
                                bottom={
                                    fieldState.error && fieldState.error.message
                                }
                            >
                                <ChipsSelect
                                    name={field.name}
                                    showSelected={false}
                                    placeholder="Ничего не выбрано"
                                    filterFn={() => true}
                                    value={
                                        field.value
                                            ? field.value.map((item: Boec) => ({
                                                  value: item.id,
                                                  label: item.fullName,
                                              }))
                                            : []
                                    }
                                    options={fetchedUsers}
                                    onChange={(items) =>
                                        field.onChange(
                                            items.map((item) => ({
                                                id: item.value,
                                                fullName: item.label,
                                            }))
                                        )
                                    }
                                    renderOption={({
                                        option,
                                        ...restProps
                                    }) => <CustomSelectOption {...restProps} />}
                                    fetching={isUsersFetching}
                                    onInputChange={handleInput}
                                />
                            </FormItem>
                        )}
                    />
                    <Controller
                        control={control}
                        name="brigades_id"
                        rules={{ required: false }}
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Отряд"
                                status={
                                    fieldState.invalid ? "error" : "default"
                                }
                                bottom={
                                    fieldState.error && fieldState.error.message
                                }
                            >
                                <ChipsSelect
                                    placeholder="Ничего не выбрано"
                                    name={field.name}
                                    value={
                                        field.value
                                            ? field.value.map(
                                                  (item: number) => ({
                                                      value: item,
                                                      label: brigadeList.find(
                                                          (subItem) =>
                                                              subItem.id ===
                                                              item
                                                      )?.title,
                                                  })
                                              )
                                            : []
                                    }
                                    emptyText="Не выбран"
                                    options={
                                        brigadeList
                                            ? brigadeList.map((item) => ({
                                                  label: item.title,
                                                  value: item.id,
                                              }))
                                            : []
                                    }
                                    onChange={(items) =>
                                        field.onChange(
                                            items.map((item) => item.value)
                                        )
                                    }
                                    renderOption={({
                                        option,
                                        ...restProps
                                    }) => <CustomSelectOption {...restProps} />}
                                />
                            </FormItem>
                        )}
                    /> */}
                    <Controller
                        control={control}
                        name="title"
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Название"
                                status={
                                    fieldState.invalid ? "error" : "default"
                                }
                                bottom={
                                    fieldState.error && fieldState.error.message
                                }
                            >
                                <Input
                                    type="text"
                                    name={field.name}
                                    value={field.value || undefined}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            </FormItem>
                        )}
                    />
                    <Controller
                        control={control}
                        name="isСontender"
                        rules={{ required: false }}
                        render={({ field, fieldState }) => (
                            <FormItem
                                status={
                                    fieldState.invalid ? "error" : "default"
                                }
                                bottom={
                                    fieldState.error && fieldState.error.message
                                }
                            >
                                <Checkbox
                                    onBlur={field.onBlur}
                                    checked={field.value}
                                    onChange={field.onChange}
                                    name={field.name}
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
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Занятое место"
                                status={
                                    fieldState.invalid ? "error" : "default"
                                }
                                bottom={
                                    fieldState.error && fieldState.error.message
                                }
                            >
                                <Select
                                    name={field.name}
                                    value={field.value || undefined}
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
                                    onChange={field.onChange}
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
                            {eventOrder ? "Сохранить" : "Создать"}
                        </Button>
                    </FormItem>
                </FormLayout>
                {SnackBar}
            </Group>
        </Panel>
    );
});
