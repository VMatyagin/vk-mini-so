import React, { FC, useCallback, useEffect, useState } from "react";
import {
    PanelHeader,
    Title,
    PanelHeaderBack,
    Group,
    Panel,
    FormLayout,
    FormItem,
    Input,
    Button,
    Select,
    CustomSelectOption,
    ScreenSpinner,
    CellButton,
    Alert,
} from "@vkontakte/vkui";

import { observer } from "mobx-react";
import { useMst } from "../../stores";
import { Event, Shtab } from "../../types";
import { Controller, useForm } from "react-hook-form";
import { ListResponse } from "../../utils/types";
import { useFetch } from "../../utils/useFetch";
import { SoAPI } from "../../utils/api.service";
import { dirtyValues } from "../../utils";
import { SuccessSnackbar } from "../../../ui/molecules/SuccessSnackbar";

export const EventEditPanel: FC<{ id: string }> = observer(({ id }) => {
    const { router, event } = useMst();
    const [shtabList, setList] = useState<Shtab[]>();
    const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);
    const onLoad = useCallback(
        (data: ListResponse<Shtab>) => {
            setList(data.items);
            router.closePopout();
        },
        [router]
    );
    const { fetch } = useFetch(SoAPI.getShtabList, onLoad);
    useEffect(() => {
        if (event.eventData) {
            router.openPopout(<ScreenSpinner />);
            fetch();
        }
    }, [event.eventData, fetch, router]);
    const {
        handleSubmit,
        errors,
        control,
        register,
        formState,
        reset,
    } = useForm<Event>({
        defaultValues: event.eventData || {},
        reValidateMode: "onChange",
        mode: "onChange",
    });
    const { isDirty, isValid, dirtyFields } = formState;

    const onSubmit = (values: Event) => {
        router.openPopout(<ScreenSpinner />);
        const fn = event.eventData ? SoAPI.updateEvent : SoAPI.createEvent;
        const isNew = !!!event.eventData;
        fn({
            ...dirtyValues(dirtyFields, values),
            id: values.id || undefined,
        }).then(({ data }) => {
            event.setEvent(data);
            router.closePopout();
            reset(data);
            setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
            isNew && event.reset();
            router.goBack();
        });
    };
    const onDelete = () => {
        router.openPopout(
            <Alert
                actions={[
                    {
                        title: "Удалить",
                        mode: "destructive",
                        autoclose: true,
                        action: () => {
                            // currentSeason &&
                            //     SoAPI.deleteSeason(currentSeason.id.toString());
                            router.goBack(undefined, 2);
                            event.reset();
                        },
                    },
                    {
                        title: "Отмена",
                        autoclose: true,
                        mode: "cancel",
                    },
                ]}
                actionsLayout="vertical"
                onClose={router.closePopout}
                header="Подтвердите действие"
                text="Вы уверены, что хотите удалить это мероприятие?"
            />
        );
    };

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={router.goBack} />}>
                <Title level="2" weight="bold">
                    {event.eventData ? "Редактирование" : "Новое мероприятие"}
                </Title>
            </PanelHeader>

            <Group>
                <FormLayout onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" ref={register} name="id" />
                    <Controller
                        control={control}
                        name="title"
                        rules={{ required: "Это поле необходимо заполнить" }}
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
                        name="description"
                        rules={{ required: false }}
                        render={(
                            { onChange, onBlur, value, name },
                            { invalid }
                        ) => (
                            <FormItem
                                top="Описание"
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["description"] &&
                                    errors["description"].message
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
                        name="location"
                        rules={{ required: false }}
                        render={(
                            { onChange, onBlur, value, name },
                            { invalid }
                        ) => (
                            <FormItem
                                top="Место проведения"
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["location"] &&
                                    errors["location"].message
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
                        name="worth"
                        rules={{ required: true }}
                        render={({ onChange, value, name }, { invalid }) => (
                            <FormItem
                                top="Тип мероприятия"
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["worth"] &&
                                    errors["worth"].message
                                }
                            >
                                <Select
                                    name={name}
                                    defaultValue={value}
                                    placeholder="Не выбран"
                                    options={[
                                        { label: "Не учитывается", value: "0" },
                                        { label: "Творчество", value: "1" },
                                        { label: "Спорт", value: "2" },
                                        { label: "Волонтерство", value: "3" },
                                        { label: "Городское", value: "4" },
                                    ]}
                                    onChange={onChange}
                                    renderOption={({
                                        option,
                                        ...restProps
                                    }) => <CustomSelectOption {...restProps} />}
                                />
                            </FormItem>
                        )}
                    />{" "}
                    <Controller
                        control={control}
                        name="shtab"
                        rules={{ required: false }}
                        render={({ onChange, value, name }, { invalid }) => (
                            <FormItem
                                top="Штаб-организатор"
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["shtab"] &&
                                    errors["shtab"].message
                                }
                            >
                                <Select
                                    name={name}
                                    defaultValue={value}
                                    placeholder="Не выбран"
                                    options={
                                        shtabList
                                            ? shtabList.map((item) => ({
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
                        name="startDate"
                        // rules={{ required: "Это поле необходимо заполнить" }}
                        render={(
                            { onChange, onBlur, value, name },
                            { invalid }
                        ) => (
                            <FormItem
                                top="Дата начала"
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["startDate"] &&
                                    errors["startDate"].message
                                }
                            >
                                <Input
                                    type="date"
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
                        name="startTime"
                        // rules={{ required: "Это поле необходимо заполнить" }}
                        render={(
                            { onChange, onBlur, value, name },
                            { invalid }
                        ) => (
                            <FormItem
                                top="Время начала"
                                status={invalid ? "error" : "default"}
                                bottom={
                                    errors &&
                                    errors["startTime"] &&
                                    errors["startTime"].message
                                }
                            >
                                <Input
                                    type="time"
                                    name={name}
                                    value={value ? value.substring(0, 5) : ""}
                                    onChange={onChange}
                                    onBlur={onBlur}
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
                            {event.eventData ? "Сохранить" : "Создать"}
                        </Button>
                    </FormItem>
                </FormLayout>
                {SnackBar}
            </Group>
            {event.eventData ? (
                <Group>
                    <CellButton mode="danger" onClick={onDelete}>
                        Удалить мероприятие
                    </CellButton>
                </Group>
            ) : null}
        </Panel>
    );
});
