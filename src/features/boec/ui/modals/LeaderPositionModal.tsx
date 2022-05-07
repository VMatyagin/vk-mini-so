import { Icon24Done } from "@vkontakte/icons";
import {
    ModalPage,
    ModalPageHeader,
    PanelHeaderClose,
    PanelHeaderButton,
    IOS,
    Group,
    FormItem,
    Select,
    CustomSelectOption,
    ViewWidth,
    useAdaptivity,
    usePlatform,
    FormLayout,
    DatePicker,
    Checkbox
} from "@vkontakte/vkui";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRoute } from "react-router5";
import { positions } from "../../../brigades/helpers";
import { RouterStoreInstance } from "../../../stores/router-store";
import { Position } from "../../../types";

export const MODAL_BOEC_POSITION_SELECT = "MODAL_BOEC_POSITION_SELECT";

export const LeaderPositionModal = () => {
    const { closeModal, modalCallback, closeModalStack } = RouterStoreInstance;
    const { route } = useRoute();
    const { position, brigadeId } = useMemo(() => route.params, [route]);

    const onPositionSelect = () => {
        modalCallback[MODAL_BOEC_POSITION_SELECT](getValues());
        closeModalStack();
        reset({
            toDate: null
        });
    };

    const onSelectPositionClose = () => {
        closeModal();
        reset({
            toDate: null
        });
    };
    const platform = usePlatform();
    const { viewWidth = 100 } = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;

    const { handleSubmit, control, formState, reset, getValues } =
        useForm<Position>({
            mode: "onChange"
        });
    useEffect(() => {
        if (position) {
            reset(position);
        } else {
            reset({ toDate: null });
        }
    }, [reset, position]);
    const { isDirty, isValid } = formState;

    return (
        <ModalPage
            id={MODAL_BOEC_POSITION_SELECT}
            dynamicContentHeight={true}
            header={
                <ModalPageHeader
                    left={
                        isMobile && (
                            <PanelHeaderClose onClick={onSelectPositionClose} />
                        )
                    }
                    right={
                        !(!isDirty || !isValid) && (
                            <PanelHeaderButton onClick={onPositionSelect}>
                                {platform === IOS ? "Готово" : <Icon24Done />}
                            </PanelHeaderButton>
                        )
                    }
                >
                    Выбор должности
                </ModalPageHeader>
            }
            onClose={onSelectPositionClose}
        >
            <Group style={{ minHeight: "100%" }}>
                <FormLayout onSubmit={handleSubmit(onPositionSelect)}>
                    <Controller
                        control={control}
                        name="position"
                        rules={{
                            required: "Это поле необходимо заполнить"
                        }}
                        render={({
                            field: { name, value, onChange },
                            fieldState
                        }) => (
                            <FormItem
                                top="Должность"
                                status={
                                    fieldState.invalid ? "error" : "default"
                                }
                                bottom={
                                    fieldState.error && fieldState.error.message
                                }
                            >
                                <Select
                                    name={name}
                                    placeholder="Не выбран"
                                    value={value}
                                    options={positions
                                        .map((position, index) => ({
                                            label: position.title,
                                            value: index
                                        }))
                                        .filter(
                                            option =>
                                                !brigadeId || option.value !== 0
                                        )}
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
                        name="fromDate"
                        render={({ field }) => (
                            <FormItem top="Дата вступления">
                                <DatePicker
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
                                            : {
                                                  day: new Date().getDate(),
                                                  month:
                                                      new Date().getMonth() + 1,
                                                  year: new Date().getFullYear()
                                              }
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
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                            <>
                                <Checkbox
                                    checked={field.value === null}
                                    onChange={() =>
                                        field.onChange(
                                            field.value === null
                                                ? new Date().toISOString()
                                                : null
                                        )
                                    }
                                >
                                    По настоящее время
                                </Checkbox>

                                {field.value !== null && (
                                    <FormItem top="Дата окончания">
                                        <DatePicker
                                            name={field.name}
                                            min={{
                                                day: 1,
                                                month: 1,
                                                year:
                                                    new Date().getFullYear() - 1
                                            }}
                                            max={{
                                                day: 1,
                                                month: 1,
                                                year:
                                                    new Date().getFullYear() + 1
                                            }}
                                            onDateChange={({
                                                day,
                                                month,
                                                year
                                            }) => {
                                                field.onChange(
                                                    new Date(
                                                        year,
                                                        month - 1,
                                                        day
                                                    ).toISOString()
                                                );
                                            }}
                                            defaultValue={
                                                field.value !== null
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
                                                    : {
                                                          day: new Date().getDate(),
                                                          month:
                                                              new Date().getMonth() +
                                                              1,
                                                          year: new Date().getFullYear()
                                                      }
                                            }
                                            dayPlaceholder="ДД"
                                            monthPlaceholder="ММММ"
                                            yearPlaceholder="ГГГГ"
                                        />
                                    </FormItem>
                                )}
                            </>
                        )}
                    />
                </FormLayout>
            </Group>
        </ModalPage>
    );
};
