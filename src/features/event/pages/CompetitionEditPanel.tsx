import { FC, useContext, useEffect, useMemo } from "react";
import {
  Panel,
  PanelHeaderBack,
  Title,
  PanelProps,
  Button,
  Checkbox,
  FormItem,
  FormLayout,
  Group,
  Input,
  ScreenSpinner,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { useRoute } from "react-router5";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { routerStore } from "../../stores/router-store";
import { Competition } from "../../types";
import { EventAPI } from "../../utils/requests/event-request";

export const CompetitionEditPanel: FC<PanelProps> = observer((props) => {
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { competitionId, eventId } = useMemo(() => route.params, [route]);
  const { openPopout, closePopout } = useContext(routerStore);

  const queryClient = useQueryClient();

  const { handleSubmit, control, formState, reset } = useForm<Competition>({
    mode: "onChange",
  });
  const { isDirty, isValid } = formState;

  useEffect(() => {
    const queryCache = queryClient.getQueryCache();
    const query = queryCache.find<Competition>(["competition", competitionId]);
    if (query?.state.data) {
      const competition = query?.state.data;
      reset(competition);
    }
  }, [competitionId, queryClient, reset]);

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
      onSuccess: (data) => {
        closePopout();
        navigate(
          "else.competition.details",
          {
            competitionId: data.id,
          },
          { replace: true }
        );
      },
      onError: closePopout,
    }
  );

  const onSubmit = (values: Competition) => {
    mutate({
      eventId,
      competition: values,
    });
  };
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          {competitionId ? "Редактирование" : "Новый конкурс"}
        </Title>
      </PanelHeader>
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
      </Group>{" "}
    </Panel>
  );
});
