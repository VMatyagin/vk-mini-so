import React, { FC, useContext, useState } from "react";
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

import { observer } from "mobx-react-lite";
import { Event, Shtab } from "../../types";
import { Controller, useForm } from "react-hook-form";
import { SoAPI } from "../../utils/api.service";
import { dirtyValues } from "../../utils";
import { SuccessSnackbar } from "../../../ui/molecules/SuccessSnackbar";
import { routerStore } from "../../stores/router-store";
import { eventStore } from "../store/eventStore";

export const EventEditPanel: FC<{ id: string }> = observer(({ id }) => {
    const { goBack, openPopout, closePopout } = useContext(routerStore);
    const { eventData, setEvent } = useContext(eventStore);

    const [shtabList] = useState<Shtab[]>();
    const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);
    // const onLoad = useCallback(
    //     (data: ListResponse<Shtab>) => {
    //         setList(data.items);
    //         closePopout();
    //     },
    //     [closePopout]
    // );
    // const { fetch } = useFetch(SoAPI.getShtabList, onLoad);
    // useEffect(() => {
    //     if (eventData) {
    //         openPopout(<ScreenSpinner />);
    //         fetch();
    //     }
    // }, [eventData, fetch, openPopout]);
    const { handleSubmit, control, formState, reset } = useForm<Event>({
        defaultValues: eventData || {},
        reValidateMode: "onChange",
        mode: "onChange",
    });
    const { isDirty, isValid, dirtyFields } = formState;

    const onSubmit = (values: Event) => {
        openPopout(<ScreenSpinner />);
        const fn = eventData ? SoAPI.updateEvent : SoAPI.createEvent;
        const isNew = !!!eventData;
        fn({
            ...dirtyValues(dirtyFields, values),
            id: values.id || undefined,
        }).then(({ data }) => {
            setEvent(data);
            closePopout();
            reset(data);
            setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
            isNew && reset();
            goBack();
        });
    };
    const onDelete = () => {
        openPopout(
            <Alert
                actions={[
                    {
                        title: "Удалить",
                        mode: "destructive",
                        autoclose: true,
                        action: () => {
                            eventData &&
                                SoAPI.removeEvent(eventData.id).then(() => {
                                    goBack(undefined, 2);
                                    reset();
                                });
                        },
                    },
                    {
                        title: "Отмена",
                        autoclose: true,
                        mode: "cancel",
                    },
                ]}
                actionsLayout="vertical"
                onClose={closePopout}
                header="Подтвердите действие"
                text="Вы уверены, что хотите удалить это мероприятие?"
            />
        );
    };

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    {eventData ? "Редактирование" : "Новое мероприятие"}
                </Title>
            </PanelHeader>

            <Group>
                <FormLayout onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name="title"
                        rules={{ required: "Это поле необходимо заполнить" }}
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
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            </FormItem>
                        )}
                    />
                    <Controller
                        control={control}
                        name="description"
                        rules={{ required: false }}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Описание"
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
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            </FormItem>
                        )}
                    />
                    <Controller
                        control={control}
                        name="location"
                        rules={{ required: false }}
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Место проведения"
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
                        name="worth"
                        rules={{ required: true }}
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Тип мероприятия"
                                status={
                                    fieldState.invalid ? "error" : "default"
                                }
                                bottom={
                                    fieldState.error && fieldState.error.message
                                }
                            >
                                <Select
                                    name={field.name}
                                    defaultValue={field.value}
                                    placeholder="Не выбран"
                                    options={[
                                        { label: "Не учитывается", value: "0" },
                                        { label: "Творчество", value: "1" },
                                        { label: "Спорт", value: "2" },
                                        { label: "Волонтерство", value: "3" },
                                        { label: "Городское", value: "4" },
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
                    <Controller
                        control={control}
                        name="shtab"
                        rules={{ required: false }}
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Штаб-организатор"
                                status={
                                    fieldState.invalid ? "error" : "default"
                                }
                                bottom={
                                    fieldState.error && fieldState.error.message
                                }
                            >
                                <Select
                                    name={field.name}
                                    defaultValue={field.value || undefined}
                                    placeholder="Не выбран"
                                    options={
                                        shtabList
                                            ? shtabList.map((item) => ({
                                                  label: item.title,
                                                  value: item.id,
                                              }))
                                            : []
                                    }
                                    onChange={field.onChange}
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
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Дата начала"
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
                        name="startTime"
                        // rules={{ required: "Это поле необходимо заполнить" }}
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Время начала"
                                status={
                                    fieldState.invalid ? "error" : "default"
                                }
                                bottom={
                                    fieldState.error && fieldState.error.message
                                }
                            >
                                <Input
                                    type="time"
                                    name={field.name}
                                    value={
                                        field.value
                                            ? field.value.substring(0, 5)
                                            : ""
                                    }
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
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
                            {eventData ? "Сохранить" : "Создать"}
                        </Button>
                    </FormItem>
                </FormLayout>
                {SnackBar}
            </Group>
            {eventData && (
                <Group>
                    <CellButton mode="danger" onClick={onDelete}>
                        Удалить мероприятие
                    </CellButton>
                </Group>
            )}
        </Panel>
    );
});
