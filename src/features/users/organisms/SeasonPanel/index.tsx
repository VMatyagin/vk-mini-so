import {
    Alert,
    Button,
    CustomSelectOption,
    FormItem,
    FormLayout,
    Input,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    ScreenSpinner,
    Select,
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SuccessSnackbar } from "../../../../ui/molecules/SuccessSnackbar";
import { useMst } from "../../../stores";
import { Brigade, Seasons } from "../../../types";
import { SoAPI } from "../../../utils/api.service";
import { ListResponse } from "../../../utils/types";
import { useFetch } from "../../../utils/useFetch";

export const SeasonPanel: FC<{ id: string }> = observer(({ id }) => {
    const { router, boec } = useMst();
    const [brigadeList, setBrigades] = useState<Brigade[]>([]);
    const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);

    const onLoad = useCallback((data: ListResponse<Brigade>) => {
        setBrigades(data.items);
    }, []);
    const { fetch } = useFetch(SoAPI.getBrigadesList, onLoad);
    useEffect(() => {
        boec.boecData && fetch();
    }, [boec.boecData, fetch]);

    const currentSeason = useMemo(
        () =>
            boec.boecData
                ? boec.boecData.seasons.find(
                      (item) => item.id === boec.selectedSeason
                  )
                : {
                      boec: "",
                      brigade: {
                          id: "",
                      },
                      id: "",
                      year: "",
                  },
        [boec]
    );

    const {
        handleSubmit,
        errors,
        control,
        register,
        formState,
        reset,
    } = useForm<Record<keyof Seasons, string>>({
        defaultValues: {
            boec: boec.boecData!.id.toString(),
            brigade:
                currentSeason && currentSeason.brigade
                    ? currentSeason.brigade.id.toString()
                    : undefined,
            id:
                currentSeason && currentSeason.id
                    ? currentSeason.id.toString()
                    : undefined,
            year:
                currentSeason && currentSeason.year
                    ? currentSeason.year.toString()
                    : undefined,
        },
        reValidateMode: "onChange",
        mode: "onChange",
    });
    const { isDirty, isValid } = formState;

    const onSubmit = (values: Record<keyof Seasons, string>) => {
        router.openPopout(<ScreenSpinner />);
        const fn = currentSeason ? SoAPI.updateSeason : SoAPI.setSeason;
        fn(values).then(({ data }) => {
            boec.fetchBoec(boec.boecData!.id.toString());
            router.closePopout();
            reset(data);
            setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
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
                            currentSeason &&
                                SoAPI.deleteSeason(currentSeason.id.toString());
                            router.goBack(2);
                            boec.fetchBoec(boec.boecData!.id.toString());
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
                text="Вы уверены, что хотите удалить это Сезон?"
            />
        );
    };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={router.goBack} />}>
                Сезон
            </PanelHeader>
            <FormLayout onSubmit={handleSubmit(onSubmit)}>
                {currentSeason && (
                    <input type="hidden" ref={register} name="id" />
                )}
                <input type="hidden" ref={register} name="boec" />
                <Controller
                    control={control}
                    name="brigade"
                    rules={{ required: "Это поле необходимо заполнить" }}
                    render={({ onChange, value, name }, { invalid }) => (
                        <FormItem
                            top="Отряд"
                            status={invalid ? "error" : "default"}
                            bottom={
                                errors &&
                                errors["year"] &&
                                errors["year"].message
                            }
                        >
                            <Select
                                name={name}
                                defaultValue={value}
                                placeholder="Не выбран"
                                options={brigadeList.map((user) => ({
                                    label: user.title,
                                    value: user.id.toString(),
                                }))}
                                onChange={onChange}
                                renderOption={({ option, ...restProps }) => (
                                    <CustomSelectOption {...restProps} />
                                )}
                            />
                        </FormItem>
                    )}
                />
                <Controller
                    control={control}
                    name="year"
                    rules={{ required: "Это поле необходимо заполнить" }}
                    render={(
                        { onChange, onBlur, value, name },
                        { invalid }
                    ) => (
                        <FormItem
                            top="Год"
                            status={invalid ? "error" : "default"}
                            bottom={
                                errors &&
                                errors["year"] &&
                                errors["year"].message
                            }
                        >
                            <Input
                                type="number"
                                placeholder="Не указан"
                                name={name}
                                value={value}
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
                        Сохранить
                    </Button>
                </FormItem>
            </FormLayout>
            {currentSeason && (
                <FormItem>
                    <Button
                        onClick={onDelete}
                        size="l"
                        stretched={true}
                        mode="outline"
                    >
                        Удалить
                    </Button>
                </FormItem>
            )}
            {SnackBar}
        </Panel>
    );
});
