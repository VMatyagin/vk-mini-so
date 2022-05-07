import {
    Button,
    FormItem,
    FormLayout,
    Group,
    Header,
    Input,
    ScreenSpinner
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useRoute } from "react-router5";
import { routerStore } from "../../../../stores/router-store";
import { Shtab } from "../../../../types";
import { ShtabsAPI } from "../../../../utils/requests/shtab-request";

export const MainInfoForm: FC = observer(() => {
    const { openPopout, closePopout } = useContext(routerStore);
    const { route, router } = useRoute();
    const { shtabId } = useMemo(() => route.params, [route]);

    const { data: brigade } = useQuery({
        queryKey: ["shtab", shtabId!],
        queryFn: ({ queryKey }) => {
            openPopout(<ScreenSpinner />);
            return ShtabsAPI.getShtab(queryKey[1] as number);
        },
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!shtabId,
        onSuccess: closePopout,
        onError: closePopout
    });

    const { handleSubmit, control, formState } = useForm<Shtab>({
        defaultValues: { ...brigade! },
        mode: "onChange"
    });
    const { isDirty, isValid } = formState;

    const onSubmit = async (values: Shtab) => {
        openPopout(<ScreenSpinner />);
        await ShtabsAPI.updateShtab(values)
            .then(() => {
                router.navigate(
                    "else.shtab.details",
                    { shtabId },
                    { replace: true }
                );
            })
            .finally(closePopout);
    };

    return (
        <Group header={<Header mode="secondary">Информация о штабе</Header>}>
            <FormLayout onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="title"
                    rules={{ required: "Это поле необходимо заполнить" }}
                    render={({ field, fieldState }) => (
                        <FormItem
                            top="Название"
                            status={fieldState.invalid ? "error" : "default"}
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
                <FormItem>
                    <Button
                        size="l"
                        stretched={true}
                        type="submit"
                        disabled={!isDirty || !isValid}
                    >
                        Сохранить
                    </Button>
                </FormItem>
            </FormLayout>
        </Group>
    );
});
