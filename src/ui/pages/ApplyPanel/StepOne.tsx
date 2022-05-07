import { Button, FormItem, Group, Header } from "@vkontakte/vkui";
import { useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { stepContext } from ".";
import { Area } from "../../../features/types";
import { AreaAPI } from "../../../features/utils/requests/area-requests";
import { LazySelect } from "../../organisms/LazySelect";

export const StepOne = () => {
    const { setStep } = useContext(stepContext);
    const { setValue } = useFormContext();

    const handleSkip = () => {
        setValue("area", null);
        setStep(1);
    };
    return (
        <Group header={<Header>Давай определимся с направлением</Header>}>
            <Controller
                name="area"
                rules={{
                    required: "Это поле необходимо заполнить"
                }}
                render={({ field, fieldState }) => (
                    <>
                        <FormItem
                            top="Предпочтительное направление"
                            status={fieldState.invalid ? "error" : "default"}
                            bottom={
                                fieldState?.error?.message ||
                                "Свой выбор всегда можно будет изменить"
                            }
                        >
                            <LazySelect
                                name={field.name}
                                onChange={field.onChange}
                                value={field.value}
                                fetchFn={AreaAPI.getAreas}
                                queryKey={"areas-list"}
                                parseItem={(area: Area) => ({
                                    label: area.title,
                                    value: area.id
                                })}
                            />
                        </FormItem>
                        <FormItem>
                            <Button
                                size="l"
                                stretched={true}
                                onClick={() => setStep(1)}
                                mode="outline"
                                type="button"
                                disabled={!field.value}
                            >
                                Далее
                            </Button>
                        </FormItem>
                    </>
                )}
            />
            <Button
                size="l"
                stretched={true}
                onClick={handleSkip}
                mode="tertiary"
                type="button"
            >
                Пропустить
            </Button>
        </Group>
    );
};
