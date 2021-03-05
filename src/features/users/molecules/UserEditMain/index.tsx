import {
    Button,
    DatePicker,
    FormItem,
    FormLayout,
    Group,
    Input,
    ScreenSpinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import React, { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { SuccessSnackbar } from "../../../../ui/molecules/SuccessSnackbar";
import { useMst } from "../../../stores";
import { Boec } from "../../../types";
import { SoAPI } from "../../../utils/api.service";

export const UserEditMain: FC = observer(() => {
    const { boec, router } = useMst();
    const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);

    const {
        handleSubmit,
        errors,
        control,
        register,
        formState,
        reset,
    } = useForm<Boec>({
        defaultValues: boec.boecData!,
        reValidateMode: "onChange",
        mode: "onChange",
    });
    const { isDirty, isValid } = formState;

    const onSubmit = (values: Boec) => {
        router.openPopout(<ScreenSpinner />);
        SoAPI.updateBoecData(values).then(({ data }) => {
            boec.setBoec(data);
            router.closePopout();
            reset(data);
            setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
        });
    };
    return boec.boecData ? (
        <Group>
            <FormLayout onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" ref={register} name="id" />
                <Controller
                    control={control}
                    name="lastName"
                    rules={{ required: "Это поле необходимо заполнить" }}
                    render={(
                        { onChange, onBlur, value, name },
                        { invalid }
                    ) => (
                        <FormItem
                            top="Фамилия"
                            status={invalid ? "error" : "default"}
                            bottom={
                                errors &&
                                errors["lastName"] &&
                                errors["lastName"].message
                            }
                        >
                            <Input
                                type="text"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        </FormItem>
                    )}
                />
                <Controller
                    control={control}
                    name="firstName"
                    rules={{ required: "Это поле необходимо заполнить" }}
                    render={(
                        { onChange, onBlur, value, name },
                        { invalid }
                    ) => (
                        <FormItem
                            top="Имя"
                            status={invalid ? "error" : "default"}
                            bottom={
                                errors &&
                                errors["firstName"] &&
                                errors["firstName"].message
                            }
                        >
                            <Input
                                type="text"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        </FormItem>
                    )}
                />
                <Controller
                    control={control}
                    name="middleName"
                    rules={{ required: "Это поле необходимо заполнить" }}
                    render={(
                        { onChange, onBlur, value, name },
                        { invalid }
                    ) => (
                        <FormItem
                            top="Отчество"
                            status={invalid ? "error" : "default"}
                            bottom={
                                errors &&
                                errors["middleName"] &&
                                errors["middleName"].message
                            }
                        >
                            <Input
                                type="text"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                        </FormItem>
                    )}
                />
                <Controller
                    control={control}
                    name="DOB"
                    // rules={{ required: "Это поле необходимо заполнить" }}
                    render={({ onChange, value, name }) => (
                        <FormItem top="Дата рождения">
                            <DatePicker
                                name={name}
                                defaultValue={
                                    value
                                        ? {
                                              day: new Date(value).getDate(),
                                              month:
                                                  new Date(value).getMonth() +
                                                  1,
                                              year: new Date(
                                                  value
                                              ).getFullYear(),
                                          }
                                        : undefined
                                }
                                onDateChange={({ day, month, year }) => {
                                    onChange(`${year}-${month}-${day}`);
                                }}
                                dayPlaceholder="ДД"
                                monthPlaceholder="ММММ"
                                yearPlaceholder="ГГГГ"
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
                        Сохранить
                    </Button>
                </FormItem>
            </FormLayout>
            {SnackBar}
        </Group>
    ) : null;
});
