import {
  FormLayout,
  FormItem,
  Input,
  Button,
  ScreenSpinner,
  Checkbox,
  Group,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useRoute } from "react-router5";
import { routerStore } from "../../../../stores/router-store";
import { Competition } from "../../../../types";
import { EventAPI } from "../../../../utils/requests/event-request";

export const CompetitionMainInfoForm: FC = observer(() => {
  const { route } = useRoute();
  const { eventId, competitionId } = useMemo(() => route.params, [route]);
  const { openPopout, closePopout } = useContext(routerStore);

  const { data } = useQuery({
    queryKey: ["competition", competitionId],
    queryFn: ({ queryKey }) => {
      openPopout(<ScreenSpinner />);
      return EventAPI.getCompetition(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    onSuccess: closePopout,
    enabled: !!competitionId,
  });

  const { mutate } = useMutation<
    Competition,
    Error,
    {
      competition: Competition;
      eventId: number;
    }
  >(
    ({ competition, eventId }) => {
      openPopout(<ScreenSpinner />);
      if (competitionId) {
        return EventAPI.updateCompetition({
          competition: competition!,
        });
      } else {
        return EventAPI.createCompetition({
          competition: competition!,
          eventId,
        });
      }
    },
    {
      onSuccess: () => {
        closePopout();
        window.history.back();
      },
    }
  );

  const { handleSubmit, control, formState } = useForm<Competition>({
    defaultValues: {
      id: data?.id,
      title: data?.title,
      ratingless: data?.ratingless,
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const { isDirty, isValid } = formState;

  const onSubmit = (values: Competition) => {
    eventId &&
      mutate({
        eventId: eventId,
        competition: values,
      });
  };

  return (
    <Group>
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="title"
          rules={{ required: "Это поле необходимо заполнить" }}
          render={({ field, fieldState }) => (
            <FormItem
              top="Название"
              status={fieldState.invalid ? "error" : "default"}
              bottom={fieldState.error && fieldState.error.message}
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
        <Controller
          control={control}
          name="ratingless"
          render={({ field, fieldState }) => (
            <FormItem
              status={fieldState.invalid ? "error" : "default"}
              bottom={fieldState.error && fieldState.error.message}
            >
              <Checkbox
                name={field.name}
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              >
                Не учитывать в рейтинге
              </Checkbox>
            </FormItem>
          )}
        />
        <FormItem>
          <Button
            size="l"
            stretched={true}
            disabled={!isDirty || !isValid}
            type="submit"
          >
            {competitionId ? "Сохранить" : "Создать"}
          </Button>
        </FormItem>
      </FormLayout>
    </Group>
  );
});
