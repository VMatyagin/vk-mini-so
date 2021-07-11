import {
    Button,
    FormItem,
    FormLayout,
    Group,
    Header,
    Input,
    ScreenSpinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { routerStore } from "../../../../stores/router-store";
import { Brigade } from "../../../../types";
import { ShtabsAPI } from "../../../../utils/requests/shtab-request";
import { shtabStore } from "../../../store/shtabStore";

interface MainInfoFormProps {
    onSuccess: () => void;
}

export const MainInfoForm: FC<MainInfoFormProps> = observer(({ onSuccess }) => {
    const { openPopout, closePopout } = useContext(routerStore);
    const { shtabId } = useContext(shtabStore);

    const { data: brigade, refetch } = useQuery({
        queryKey: ["shtab", shtabId!],
        queryFn: ({ queryKey }) => {
            openPopout(<ScreenSpinner />);
            return ShtabsAPI.getShtab(queryKey[1] as number);
        },
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!shtabId,
        onSuccess: closePopout,
    });

    const { handleSubmit, control, formState, reset } = useForm<Brigade>({
        defaultValues: { ...brigade! },
        mode: "onChange",
    });
    const { isDirty, isValid } = formState;

    const onSubmit = (values: Brigade) => {
        openPopout(<ScreenSpinner />);
        ShtabsAPI.updateShtab(values).then((data) => {
            refetch();
            closePopout();
            reset(data);
            onSuccess();
        });
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
                        disabled={!isDirty || !isValid}
                    >
                        Сохранить
                    </Button>
                </FormItem>
            </FormLayout>
        </Group>
    );
});
