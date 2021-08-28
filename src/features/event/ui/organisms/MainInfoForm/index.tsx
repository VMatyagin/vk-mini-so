import {
    FormLayout,
    FormItem,
    Input,
    Select,
    CustomSelectOption,
    Button,
    ScreenSpinner,
    DatePicker,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { LazySelect } from "../../../../../ui/organisms/LazySelect";
import { routerStore } from "../../../../stores/router-store";
import { EventType, Shtab } from "../../../../types";
import { dirtyValues } from "../../../../utils";
import { EventAPI } from "../../../../utils/requests/event-request";
import { ShtabsAPI } from "../../../../utils/requests/shtab-request";
import { EVENT_WORTH } from "../../../helpers";
import { eventStore } from "../../../store/eventStore";

export const MainInfoForm: FC = observer(() => {
    const { eventId } = useContext(eventStore);
    const { openPopout, closePopout, goBack } = useContext(routerStore);
    const queryClient = useQueryClient();

    const { data } = useQuery<EventType>({
        queryKey: ["event", eventId!],
        queryFn: ({ queryKey }) => {
            return EventAPI.getEvent(queryKey[1] as number);
        },
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!eventId,
    });

    const { handleSubmit, control, formState } = useForm<EventType>({
        defaultValues: data,
        reValidateMode: "onChange",
        mode: "onChange",
    });
    const { isDirty, isValid, dirtyFields } = formState;

    const { mutate } = useMutation<EventType, Error, EventType>(
        (values) => {
            openPopout(<ScreenSpinner />);
            if (eventId) {
                return EventAPI.updateEvent({
                    ...dirtyValues(dirtyFields, values),
                    id: values.id,
                });
            }
            return EventAPI.createEvent(values);
        },
        {
            onSuccess: (data) => {
                queryClient.setQueryData(["event", data.id], data);

                closePopout();
                goBack();
            },
        }
    );
    const onSubmit = (values: EventType) => {
        mutate(values);
    };

    return (
        <FormLayout onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="title"
                rules={{ required: "Это поле необходимо заполнить" }}
                render={({ field, fieldState }) => (
                    <FormItem
                        top="Название"
                        status={fieldState.invalid ? "error" : "default"}
                        bottom={fieldState.error && fieldState.error.message}
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
                        status={fieldState.invalid ? "error" : "default"}
                        bottom={fieldState.error && fieldState.error.message}
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
                        status={fieldState.invalid ? "error" : "default"}
                        bottom={fieldState.error && fieldState.error.message}
                    >
                        <Select
                            name={field.name}
                            defaultValue={field.value}
                            placeholder="Не выбран"
                            options={EVENT_WORTH.map((worth, index) => ({
                                label: worth.title,
                                value: index,
                            }))}
                            onChange={field.onChange}
                            renderOption={({ option, ...restProps }) => (
                                <CustomSelectOption {...restProps} />
                            )}
                        />
                    </FormItem>
                )}
            />
            <Controller
                control={control}
                name="shtabId"
                // rules={{ required: "Это поле необходимо заполнить" }}
                render={({ field, fieldState }) => (
                    <FormItem
                        top="Штаб-организатор"
                        status={fieldState.invalid ? "error" : "default"}
                        bottom={fieldState.error && fieldState.error.message}
                    >
                        <LazySelect
                            name={field.name}
                            onChange={field.onChange}
                            value={field.value}
                            fetchFn={ShtabsAPI.getShtabs}
                            queryKey={"shtab-list"}
                            parseItem={(shtab: Shtab) => ({
                                label: shtab.title,
                                value: shtab.id,
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
                            name={field.name}
                            min={{
                                day: 1,
                                month: 1,
                                year: new Date().getFullYear() - 1,
                            }}
                            max={{
                                day: 1,
                                month: 1,
                                year: new Date().getFullYear() + 1,
                            }}
                            onDateChange={({ day, month, year }) => {
                                field.onChange(
                                    new Date(year, month - 1, day).toISOString()
                                );
                            }}
                            defaultValue={
                                field.value
                                    ? {
                                          day: new Date(field.value).getDate(),
                                          month:
                                              new Date(field.value).getMonth() +
                                              1,
                                          year: new Date(
                                              field.value
                                          ).getFullYear(),
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
                        status={fieldState.invalid ? "error" : "default"}
                        bottom={fieldState.error && fieldState.error.message}
                    >
                        <Input
                            type="time"
                            name={field.name}
                            value={
                                field.value ? field.value.substring(0, 5) : ""
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
                    type="submit"
                >
                    {eventId ? "Сохранить" : "Создать"}
                </Button>
            </FormItem>
        </FormLayout>
    );
});
