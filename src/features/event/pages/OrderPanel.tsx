import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
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
import { ChipsSelect } from "@vkontakte/vkui/dist/unstable";
import "@vkontakte/vkui/dist/unstable.css";

import { observer } from "mobx-react";
import { useMst } from "../../stores";
import { Controller, useForm } from "react-hook-form";
import { Boec, Brigade, EventOrder } from "../../types";
import { ListResponse } from "../../utils/types";
import { useFetch } from "../../utils/useFetch";
import { SoAPI } from "../../utils/api.service";
import { Checkbox } from "@vkontakte/vkui/dist/components/Checkbox/Checkbox";
import { dirtyValues } from "../../utils";
import { SuccessSnackbar } from "../../../ui/molecules/SuccessSnackbar";
import { ChipsInputOption } from "@vkontakte/vkui/dist/components/ChipsInput/ChipsInput";
import { debounce } from "lodash";

interface FormType extends EventOrder {
    brigades_id: number[];
}

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

    const [fetchedUsers, setFetchedUsers] = useState<ChipsInputOption[]>([]);
    const onUsersLoad = useCallback((data: ListResponse<Boec<true>>) => {
        setFetchedUsers(
            data.items.map((item) => ({
                label: item.fullName,
                value: item.id,
            }))
        );
    }, []);

    const { fetch: getUsers, isLoading: isUsersFetching } = useFetch(
        SoAPI.getList,
        onUsersLoad
    );
    const fetchUsers = useMemo(
        () => debounce(getUsers || (() => undefined), 750),
        [getUsers]
    );
    const handleInput = useCallback(
        (event?: React.ChangeEvent<HTMLInputElement>) => {
            event &&
                event.target.value &&
                fetchUsers({
                    limit: 20,
                    offset: 0,
                    search: event.target.value,
                });
        },
        [fetchUsers]
    );
    const {
        handleSubmit,
        errors,
        control,
        register,
        formState,
        reset,
    } = useForm<FormType>({
        defaultValues:
            {
                ...event.eventOrder,
                brigades_id: event.eventOrder
                    ? event.eventOrder.brigades.map((item) => item.id)
                    : [],
                participations: [
                    ...(event.eventOrder
                        ? event.eventOrder.participations
                        : []),
                ],
            } || {},
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
    console.log(fetchedUsers);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={onBack} />}>
                <Title level="2" weight="bold">
                    {event.eventOrder
                        ? `Заявка ${event.eventOrder.brigades.reduce(
                              (prev, cur) => (prev += ` ${cur.title}`),
                              ""
                          )}  ${
                              event.eventOrder.title &&
                              `- ${event.eventOrder.title}`
                          }
                    `
                        : "Создание заявки"}
                </Title>
            </PanelHeader>
            <Group>
                <FormLayout onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" ref={register} name="id" />
                    <input type="hidden" ref={register} name="event" />
                    <Controller
                        control={control}
                        name="participations"
                        rules={{ required: false }}
                        render={({ onChange, value, name }, { invalid }) => (
                            <FormItem
                                top="Участники"
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["participations"] &&
                                    "Возникла ошибка"
                                }
                            >
                                <ChipsSelect
                                    name={name}
                                    showSelected={false}
                                    placeholder="Ничего не выбрано"
                                    filterFn={() => true}
                                    value={
                                        value
                                            ? value.map((item: Boec<true>) => ({
                                                  value: item.id,
                                                  label: item.fullName,
                                              }))
                                            : []
                                    }
                                    options={fetchedUsers}
                                    onChange={(items) =>
                                        onChange(
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
                        placeholder="Ничего не выбрано"
                        rules={{ required: false }}
                        render={({ onChange, value, name }, { invalid }) => (
                            <FormItem
                                top="Отряд"
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["brigades_id"] &&
                                    "Возникла ошибка"
                                }
                            >
                                <ChipsSelect
                                    name={name}
                                    value={
                                        value
                                            ? value.map((item: number) => ({
                                                  value: item,
                                                  label: brigadeList.find(
                                                      (subItem) =>
                                                          subItem.id === item
                                                  )?.title,
                                              }))
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
                                        onChange(
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
