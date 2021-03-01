import {
    Button,
    FormItem,
    FormLayout,
    Group,
    Input,
    ScreenSpinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import React, { FC } from "react";
import { Controller, useForm } from "react-hook-form";

import { useMst } from "../../../stores";
import { Boec } from "../../../types";
import { SoAPI } from "../../../utils/api.service";

export const UserEditMode: FC<{ getBack: () => void }> = observer(
    ({ getBack }) => {
        const { boec, router } = useMst();
        const { handleSubmit, errors, control, register } = useForm<Boec>({
            defaultValues: boec.boecData!,
            reValidateMode: "onChange",
            mode: "onChange",
        });
        const onSubmit = (values: Boec) => {
            router.openPopout(<ScreenSpinner />);
            SoAPI.updateBoecData(values).then(({ data }) => {
                boec.setBoec(data);
                router.closePopout();
                getBack();
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
                            { onChange, onBlur, value, name, ref },
                            { invalid, isTouched, isDirty }
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
                            { onChange, onBlur, value, name, ref },
                            { invalid, isTouched, isDirty }
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
                            { onChange, onBlur, value, name, ref },
                            { invalid, isTouched, isDirty }
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
                    <FormItem>
                        <Button size="l" stretched>
                            Сохранить
                        </Button>
                    </FormItem>
                </FormLayout>
            </Group>
        ) : null;
    }
);
