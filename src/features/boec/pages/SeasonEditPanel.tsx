import {
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
import React, { FC, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { SuccessSnackbar } from "../../../ui/molecules/SuccessSnackbar";
import { routerStore } from "../../stores/router-store";

import { PanelProps, Seasons } from "../../types";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { boecStore } from "../store/boecStore";

export const SeasonEditPanel: FC<PanelProps> = observer(({ id }) => {
    const { openPopout, closePopout, goBack } = useContext(routerStore);
    const { boecId, updateSeasons } = useContext(boecStore);

    const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);

    const { data } = useQuery({
        queryKey: ["brigades"],
        queryFn: () => BrigadesAPI.getBrigadesList({ limit: 200 }),
        retry: 1,
        refetchOnWindowFocus: false,
    });

    const { handleSubmit, control, formState } = useForm<{
        brigade: string;
        year: string;
    }>({
        defaultValues: {
            brigade: undefined,
            year: new Date().getFullYear().toString(),
        },
        mode: "onChange",
    });

    const { isDirty, isValid } = formState;

    const onSubmit = async (values: Record<keyof Seasons, string>) => {
        openPopout(<ScreenSpinner />);
        const { data } = await BrigadesAPI.setSeason({
            brigadeId: Number(values.brigade),
            boecId: boecId!,
            year: Number(values.year),
        });
        closePopout();
        updateSeasons(data);
        goBack();
        setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
    };

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                ??????????
            </PanelHeader>
            <FormLayout onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="brigade"
                    rules={{ required: "?????? ???????? ???????????????????? ??????????????????" }}
                    render={({ field, fieldState }) => (
                        <FormItem
                            top="??????????"
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
                                        placeholder="???? ????????????"
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
                    rules={{ required: "?????? ???????? ???????????????????? ??????????????????" }}
                    render={({ field, fieldState }) => (
                        <FormItem
                            top="??????"
                            status={fieldState.invalid ? "error" : "default"}
                            bottom={
                                fieldState.error && fieldState.error.message
                            }
                        >
                            <Input
                                type="number"
                                placeholder="???? ????????????"
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
                        ??????????????????
                    </Button>
                </FormItem>
            </FormLayout>
            {SnackBar}
        </Panel>
    );
});
