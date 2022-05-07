import { FC, useContext, useMemo } from "react";
import {
    Button,
    Cell,
    Checkbox,
    CustomSelectOption,
    CustomSelectOptionInterface,
    DatePicker,
    File,
    FormItem,
    FormLayout,
    Group,
    Input,
    Panel,
    PanelHeaderBack,
    PanelProps,
    PanelSpinner,
    ScreenSpinner,
    Select,
    SimpleCell,
    Title
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { useRoute } from "react-router5";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { LazySelect } from "../../../ui/organisms/LazySelect";
import { routerStore } from "../../stores/router-store";
import { Shtab, EventType } from "../../types";
import { getDirtyFields } from "../../utils";
import { EventAPI } from "../../utils/requests/event-request";
import { ShtabsAPI } from "../../utils/requests/shtab-request";
import { EVENT_WORTH } from "../helpers";
import { Icon24Camera } from "@vkontakte/icons";
import { appStore } from "../../stores/app-store";
import { EventImage } from "../ui/atoms/EventImage";

interface EventTypePayload extends Omit<EventType, "image"> {
    selectedShtab: CustomSelectOptionInterface;
    image: File | string;
}

export const EventEditPanel: FC<PanelProps> = observer(props => {
    const { openPopout, closePopout } = useContext(routerStore);
    const { user } = useContext(appStore);
    const {
        route,
        router: { navigate }
    } = useRoute();
    const eventId = useMemo(() => route.params.eventId, [route]);

    const { handleSubmit, control, formState, reset } =
        useForm<EventTypePayload>({
            mode: "onChange"
        });

    const queryClient = useQueryClient();
    useQuery({
        queryKey: ["event", eventId],
        queryFn: ({ queryKey }) => {
            openPopout(<PanelSpinner />);
            return EventAPI.getEvent(queryKey[1] as number);
        },
        retry: false,
        enabled: !!eventId,
        refetchOnWindowFocus: false,
        onError: closePopout,
        onSuccess: (event: EventType) => {
            reset({
                ...event,
                selectedShtab: event.shtab
                    ? {
                          label: event.shtab.title,
                          value: event.shtab.id
                      }
                    : undefined
            });
            closePopout();
        }
    });

    const { isDirty, isValid, dirtyFields } = formState;

    const { mutate, isLoading } = useMutation(
        async (values: EventTypePayload) => {
            openPopout(<ScreenSpinner />);

            let event: EventType;
            const { image, selectedShtab, ...restValues } =
                getDirtyFields<EventTypePayload>(values, dirtyFields);

            if (eventId) {
                event = await EventAPI.updateEvent(values.id, {
                    ...restValues,
                    shtabId: selectedShtab
                        ? (selectedShtab.value as unknown as number)
                        : undefined
                } as EventType);
            } else {
                event = await EventAPI.createEvent({
                    ...restValues,
                    shtabId: selectedShtab
                        ? (selectedShtab.value as unknown as number)
                        : undefined
                } as EventType);
            }
            if (image) {
                const formData = new FormData();
                formData.set("file", image);

                event = await EventAPI.uploadEventImage(event.id, formData);
            }
            return event;
        },
        {
            onSuccess: data => {
                queryClient.setQueryData(["event", data.id], data);

                closePopout();
                window.history.back();
            },
            onError: closePopout
        }
    );
    const onSubmit = (values: EventTypePayload) => {
        mutate(values);
    };

    return (
        <Panel {...props}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => window.history.back()} />}
            >
                <Title level="2" weight="bold">
                    {route.params.eventId
                        ? "Редактирование"
                        : "Новое мероприятие"}
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
                        name="worth"
                        rules={{ required: "Это поле необходимо заполнить" }}
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Блок"
                                status={
                                    fieldState.invalid ? "error" : "default"
                                }
                                bottom={
                                    fieldState.error && fieldState.error.message
                                }
                            >
                                <Select
                                    name={field.name}
                                    placeholder="Не выбран"
                                    options={EVENT_WORTH.map(
                                        (worth, index) => ({
                                            label: worth.title,
                                            value: index
                                        })
                                    )}
                                    value={field.value}
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
                        name="selectedShtab"
                        // rules={{ required: "Это поле необходимо заполнить" }}
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
                                <LazySelect
                                    name={field.name}
                                    onChange={field.onChange}
                                    value={field.value}
                                    fetchFn={ShtabsAPI.getShtabs}
                                    extraFnProp={{
                                        self: user?.isStaff ? undefined : true
                                    }}
                                    queryKey={"shtab-list"}
                                    parseItem={(shtab: Shtab) => ({
                                        label: shtab.title,
                                        value: shtab.id
                                    })}
                                />
                            </FormItem>
                        )}
                    />
                    <Controller
                        control={control}
                        name="startDate"
                        rules={{ required: "Это поле необходимо заполнить" }}
                        render={({ field }) => (
                            <FormItem top="Дата начала">
                                <DatePicker
                                    key={field.value}
                                    name={field.name}
                                    min={{
                                        day: 1,
                                        month: 1,
                                        year: new Date().getFullYear() - 1
                                    }}
                                    max={{
                                        day: 1,
                                        month: 1,
                                        year: new Date().getFullYear() + 1
                                    }}
                                    onDateChange={({ day, month, year }) => {
                                        field.onChange(
                                            new Date(
                                                year,
                                                month - 1,
                                                day
                                            ).toISOString()
                                        );
                                    }}
                                    {...console.log({
                                        day: new Date(field.value!).getDate(),
                                        month:
                                            new Date(field.value!).getMonth() +
                                            1,
                                        year: new Date(
                                            field.value!
                                        ).getFullYear()
                                    })}
                                    defaultValue={
                                        field.value
                                            ? {
                                                  day: new Date(
                                                      field.value
                                                  ).getDate(),
                                                  month:
                                                      new Date(
                                                          field.value
                                                      ).getMonth() + 1,
                                                  year: new Date(
                                                      field.value
                                                  ).getFullYear()
                                              }
                                            : undefined
                                    }
                                    dayPlaceholder="ДД"
                                    monthPlaceholder="ММММ"
                                    yearPlaceholder="ГГГГ"
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
                    <Controller
                        control={control}
                        name="visibility"
                        defaultValue={false}
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
                                    name={field.name}
                                    checked={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                >
                                    Видимость
                                </Checkbox>
                            </FormItem>
                        )}
                    />
                    <Controller
                        control={control}
                        name="image"
                        rules={{
                            required: "Это поле необходимо заполнить"
                        }}
                        render={({ field, fieldState }) => (
                            <FormItem
                                top="Обложка"
                                status={
                                    fieldState.invalid ? "error" : "default"
                                }
                                bottom={
                                    fieldState.error && fieldState.error.message
                                }
                            >
                                {field.value ? (
                                    <Cell
                                        before={
                                            <EventImage
                                                src={
                                                    field.value instanceof
                                                    Object
                                                        ? URL.createObjectURL(
                                                              field.value as File
                                                          )
                                                        : (field.value as string)
                                                }
                                            />
                                        }
                                        mode="removable"
                                        onRemove={() => field.onChange(null)}
                                    />
                                ) : (
                                    <File
                                        name={field.name}
                                        before={<Icon24Camera />}
                                        controlSize="l"
                                        mode="secondary"
                                        onChange={event =>
                                            field.onChange(
                                                event.target.files?.[0]
                                            )
                                        }
                                    />
                                )}
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <Button
                            size="l"
                            stretched={true}
                            disabled={!isDirty || !isValid || isLoading}
                            type="submit"
                            loading={isLoading}
                        >
                            {eventId ? "Сохранить" : "Создать"}
                        </Button>
                    </FormItem>
                </FormLayout>
            </Group>
            <Group>
                <SimpleCell
                    onClick={() => {
                        navigate("else.competitions.create", {
                            eventId
                        });
                    }}
                >
                    Добавить конкурс
                </SimpleCell>
            </Group>
        </Panel>
    );
});
