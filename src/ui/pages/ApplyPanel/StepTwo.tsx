import { Button, FormItem, Group, Header } from "@vkontakte/vkui";
import { useContext } from "react";
import { Controller } from "react-hook-form";
import { stepContext } from ".";
import { Brigade } from "../../../features/types";
import { BrigadesAPI } from "../../../features/utils/requests/brigades-request";
import { LazySelect } from "../../organisms/LazySelect";

export const StepTwo = () => {
  const { setStep } = useContext(stepContext);

  return (
    <Group
      header={
        <Header>Наверное, у тебя уже есть понравившийся глазу отряд?</Header>
      }
    >
      <Controller
        name="brigadeId"
        render={({ field, fieldState }) => (
          <>
            <FormItem
              top="Отряд"
              status={fieldState.invalid ? "error" : "default"}
              bottom={fieldState?.error?.message}
            >
              <LazySelect
                name={field.name}
                onChange={field.onChange}
                value={field.value}
                fetchFn={BrigadesAPI.getBrigadesList}
                queryKey={"brigade-list"}
                parseItem={(brigade: Brigade) => ({
                  label: brigade.fullTitle,
                  value: brigade.id,
                  description: "Университет? или штаб?",
                })}
              />
            </FormItem>
            <FormItem>
              <Button
                size="l"
                stretched={true}
                onClick={() => setStep(2)}
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
        onClick={() => setStep(2)}
        mode="tertiary"
        type="button"
      >
        Пропустить
      </Button>
    </Group>
  );
};
