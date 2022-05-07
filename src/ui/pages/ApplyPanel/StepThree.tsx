import {
    Group,
    FormItem,
    Input,
    DatePicker,
    Checkbox,
    Textarea,
    Button
} from "@vkontakte/vkui";
import { Controller, useFormState, useWatch } from "react-hook-form";

export const StepThree = () => {
    const { isDirty } = useFormState();
    const phoneLess = useWatch({ name: "phoneLess" });

    return (
        <Group>
            <Controller
                name="lastName"
                defaultValue=""
                render={({ field, fieldState }) => (
                    <FormItem
                        top="Фамилия"
                        status={fieldState.invalid ? "error" : "default"}
                        bottom={fieldState?.error?.message}
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
                name="firstName"
                defaultValue=""
                render={({ field, fieldState }) => (
                    <FormItem
                        top="Имя"
                        status={fieldState.invalid ? "error" : "default"}
                        bottom={fieldState?.error?.message}
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
                name="middleName"
                defaultValue=""
                render={({ field, fieldState }) => (
                    <FormItem
                        top="Отчество"
                        status={fieldState.invalid ? "error" : "default"}
                        bottom={fieldState?.error?.message}
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
                name="dateOfBirth"
                defaultValue=""
                render={({ field }) => (
                    <FormItem top="Дата рождения">
                        <DatePicker
                            name={field.name}
                            min={{ day: 1, month: 1, year: 1901 }}
                            max={{
                                day: 1,
                                month: 1,
                                year: new Date().getFullYear() - 17
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
                                          ).getFullYear()
                                      }
                                    : undefined
                            }
                            onDateChange={({ day, month, year }) => {
                                field.onChange(`${year}-${month}-${day}`);
                            }}
                            dayPlaceholder="ДД"
                            monthPlaceholder="ММММ"
                            yearPlaceholder="ГГГГ"
                        />
                    </FormItem>
                )}
            />
            <Controller
                name="phoneLess"
                defaultValue={true}
                render={({ field, fieldState }) => (
                    <FormItem
                        status={fieldState.invalid ? "error" : "default"}
                        bottom={fieldState.error && fieldState.error.message}
                    >
                        <Checkbox
                            name={field.name}
                            checked={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                        >
                            Свяжитесь со мной через ВК
                        </Checkbox>
                    </FormItem>
                )}
            />
            {phoneLess === false && (
                <Controller
                    name="phone"
                    defaultValue=""
                    shouldUnregister={true}
                    render={({ field, fieldState }) => (
                        <FormItem
                            top="Телефон"
                            status={fieldState.invalid ? "error" : "default"}
                            bottom={fieldState?.error?.message}
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
            )}
            <Controller
                name="about"
                defaultValue=""
                render={({ field, fieldState }) => (
                    <FormItem
                        top="О тебе"
                        status={fieldState.invalid ? "error" : "default"}
                        bottom={fieldState?.error?.message}
                        required
                    >
                        <Textarea
                            placeholder="Расскажи чем увлекаешься или что-нибудь что познакомит нас с тобой"
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            maxLength={1000}
                        />
                    </FormItem>
                )}
            />

            <Controller
                name="university"
                defaultValue=""
                render={({ field, fieldState }) => (
                    <FormItem
                        top="Учебное заведение, курс"
                        status={fieldState.invalid ? "error" : "default"}
                        bottom={fieldState?.error?.message}
                        required
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
            <FormItem>
                <Button
                    size="l"
                    stretched={true}
                    disabled={!isDirty}
                    type="submit"
                >
                    Подать заявку
                </Button>
            </FormItem>
        </Group>
    );
};
