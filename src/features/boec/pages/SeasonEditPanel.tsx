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
    Spinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import React, { FC, useContext, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { SuccessSnackbar } from "../../../ui/molecules/SuccessSnackbar";
import { routerStore } from "../../stores/router-store";

import { PanelProps, Seasons } from "../../types";
import { SoAPI } from "../../utils/api.service";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { boecStore } from "../store/boecStore";

export const SeasonEditPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { openPopout, closePopout, goBack } = useContext(routerStore);
    const { boecId, selectedSeason, seasons, removeSeason, updateSeasons } =
        useContext(boecStore);

    const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);

    const { data } = useQuery({
        queryKey: ["brigades"],
        queryFn: () => BrigadesAPI.getBrigadesList({ limit: 200 }),
        retry: 1,
        refetchOnWindowFocus: false,
    });

    const currentSeason = useMemo<Seasons | null>(
        () =>
            seasons
                ? seasons!.find((item) => item.id === selectedSeason)!
                : null,
        [seasons, selectedSeason]
    );

    const { handleSubmit, control, formState } = useForm<{
        brigade: string;
        year: string;
    }>({
        defaultValues: {
            brigade:
                currentSeason && currentSeason.brigade
                    ? currentSeason.brigade.id.toString()
                    : undefined,
            year:
                currentSeason && currentSeason.year
                    ? currentSeason.year.toString()
                    : new Date().getFullYear().toString(),
        },
        mode: "onChange",
    });

    const { isDirty, isValid } = formState;

    const onSubmit = async (values: Record<keyof Seasons, string>) => {
        openPopout(<ScreenSpinner />);
        const { data } = await (currentSeason
            ? SoAPI.updateSeason({
                  brigadeId: Number(values.brigade),
                  boecId: boecId!,
                  id: currentSeason.id,
                  year: Number(values.year),
              })
            : SoAPI.setSeason({
                  brigadeId: Number(values.brigade),
                  boecId: boecId!,
                  year: Number(values.year),
              }));
        closePopout();
        updateSeasons(data);
        goBack();
        setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
    };
    const mutation = useMutation(
        () => {
            openPopout(<ScreenSpinner />);

            return SoAPI.deleteSeason(currentSeason!.id);
        },
        {
            onSuccess: () => {
                closePopout();
                goBack();
                removeSeason(currentSeason!.id);
            },
        }
    );
    const onDelete = () => {
        openPopout(
            <Alert
                actions={[
                    {
                        title: "Удалить",
                        mode: "destructive",
                        autoclose: true,
                        action: mutation.mutate,
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
                text="Вы уверены, что хотите удалить это Сезон?"
            />
        );
    };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                Сезон
            </PanelHeader>
            <FormLayout onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="brigade"
                    rules={{ required: "Это поле необходимо заполнить" }}
                    render={({ field, fieldState }) => (
                        <FormItem
                            top="Отряд"
                            status={fieldState.invalid ? "error" : "default"}
                            bottom={
                                fieldState.error && fieldState.error.message
                            }
                        >
                            <>
                                {!data && (
                                    <Spinner
                                        size="small"
                                        style={{
                                            margin: "20px 0",
                                            height: 300,
                                        }}
                                    />
                                )}
                                {data && (
                                    <Select
                                        name={field.name}
                                        defaultValue={field.value}
                                        placeholder="Не выбран"
                                        options={data.items.map((user) => ({
                                            label: user.title,
                                            value: user.id,
                                        }))}
                                        onChange={field.onChange}
                                        renderOption={({
                                            option,
                                            ...restProps
                                        }) => (
                                            <CustomSelectOption
                                                {...restProps}
                                            />
                                        )}
                                    />
                                )}
                            </>
                        </FormItem>
                    )}
                />
                <Controller
                    control={control}
                    name="year"
                    rules={{ required: "Это поле необходимо заполнить" }}
                    render={({ field, fieldState }) => (
                        <FormItem
                            top="Год"
                            status={fieldState.invalid ? "error" : "default"}
                            bottom={
                                fieldState.error && fieldState.error.message
                            }
                        >
                            <Input
                                type="number"
                                placeholder="Не указан"
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                max={new Date().getFullYear()}
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
