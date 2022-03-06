import { FC, useContext, useEffect, useMemo } from "react";
import {
  Button,
  CustomSelectOption,
  CustomSelectOptionInterface,
  DatePicker,
  File,
  FormItem,
  FormLayout,
  Group,
  Input,
  Panel,
  PanelHeaderBack,
  PanelProps,
  ScreenSpinner,
  Select,
  SimpleCell,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { useRoute } from "react-router5";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient, useMutation } from "react-query";
import { LazySelect } from "../../../ui/organisms/LazySelect";
import { routerStore } from "../../stores/router-store";
import { Shtab, EventType } from "../../types";
import { dirtyValues } from "../../utils";
import { EventAPI } from "../../utils/requests/event-request";
import { ShtabsAPI } from "../../utils/requests/shtab-request";
import { EVENT_WORTH } from "../helpers";
import { Icon24Camera } from "@vkontakte/icons";

interface EventTypePayload extends EventType {
  selectedShtab: CustomSelectOptionInterface;
}

export const EventEditPanel: FC<PanelProps> = observer((props) => {
  const { openPopout, closePopout } = useContext(routerStore);
  const {
    route,
    router: { navigate },
  } = useRoute();
  const eventId = useMemo(() => route.params.eventId, [route]);

  const { handleSubmit, control, formState, reset } = useForm<EventTypePayload>(
    {
      mode: "onChange",
    }
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    const queryCache = queryClient.getQueryCache();
    const query = queryCache.find<EventType>(["event", eventId!]);
    if (query?.state.data) {
      const event = query?.state.data;
      reset({
        ...event,
        selectedShtab: event.shtab
          ? {
              label: event.shtab.title,
              value: event.shtab.id,
            }
          : undefined,
      });
    }
  }, [eventId, queryClient, reset]);

  const { isDirty, isValid, dirtyFields } = formState;

  const { mutate, isLoading } = useMutation<EventType, Error, EventType>(
    async ({ image, ...values }) => {
      openPopout(<ScreenSpinner />);

      let event: EventType;
      if (eventId) {
        event = await EventAPI.updateEvent({
          ...dirtyValues(dirtyFields, values),
          id: values.id,
        });
      } else {
        event = await EventAPI.createEvent(values as EventType);
      }
      if (image) {
        const formData = new FormData();
        formData.set("file", image);
        console.log(formData, image, values, typeof image);

        event = await EventAPI.uploadEventImage(event.id, formData);
      }
      return event;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["event", data.id], data);

        closePopout();
        window.history.back();
      },
    }
  );
  const onSubmit = ({ selectedShtab, ...values }: EventTypePayload) => {
    mutate({ ...values, shtabId: selectedShtab?.value as number });
  };

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          {route.params.eventId ? "Редактирование" : "Новое мероприятие"}
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
            name="description"
            rules={{ required: false }}
            defaultValue=""
            render={({ field, fieldState }) => (
              <FormItem
                top="Описание"
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState.error && fieldState.error.message}
              >
                <Input
                  type="text"
                  name={field.name}
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name="worth"
            rules={{ required: "Это поле необходимо заполнить" }}
            render={({ field, fieldState }) => (
              <FormItem
                top="Блок"
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState.error && fieldState.error.message}
              >
                <Select
                  name={field.name}
                  placeholder="Не выбран"
                  options={EVENT_WORTH.map((worth, index) => ({
                    label: worth.title,
                    value: index,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  renderOption={({ option, ...restProps }) => (
                    <CustomSelectOption {...restProps} />
                  )}
                />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name="selectedShtab"
            // rules={{ required: "Это поле необходимо заполнить" }}
            render={({ field, fieldState }) => (
              <FormItem
                top="Штаб-организатор"
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState.error && fieldState.error.message}
              >
                <LazySelect
                  name={field.name}
                  onChange={field.onChange}
                  value={field.value}
                  fetchFn={ShtabsAPI.getShtabs}
                  queryKey={"shtab-list"}
                  parseItem={(shtab: Shtab) => ({
                    label: shtab.title,
                    value: shtab.id,
                  })}
                />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name="startDate"
            rules={{ required: "Это поле необходимо заполнить" }}
            render={({ field }) => (
              <FormItem top="Дата начала">
                <DatePicker
                  name={field.name}
                  min={{
                    day: 1,
                    month: 1,
                    year: new Date().getFullYear() - 1,
                  }}
                  max={{
                    day: 1,
                    month: 1,
                    year: new Date().getFullYear() + 1,
                  }}
                  onDateChange={({ day, month, year }) => {
                    field.onChange(
                      new Date(year, month - 1, day).toISOString()
                    );
                  }}
                  defaultValue={
                    field.value
                      ? {
                          day: new Date(field.value).getDate(),
                          month: new Date(field.value).getMonth() + 1,
                          year: new Date(field.value).getFullYear(),
                        }
                      : undefined
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
            name="startTime"
            // rules={{ required: "Это поле необходимо заполнить" }}
            render={({ field, fieldState }) => (
              <FormItem
                top="Время начала"
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState.error && fieldState.error.message}
              >
                <Input
                  type="time"
                  name={field.name}
                  value={field.value ? field.value.substring(0, 5) : ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name="image"
            rules={{
              required: eventId ? "Это поле необходимо заполнить" : undefined,
            }}
            render={({ field, fieldState }) => (
              <FormItem
                top="Обложка"
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState.error && fieldState.error.message}
              >
                <File
                  name={field.name}
                  before={<Icon24Camera />}
                  controlSize="l"
                  mode="secondary"
                  onChange={(event) => field.onChange(event.target.files?.[0])}
                />
              </FormItem>
            )}
          />

          <FormItem>
            <Button
              size="l"
              stretched={true}
              disabled={!isDirty || !isValid || isLoading}
              type="submit"
              loading={isLoading}
            >
              {eventId ? "Сохранить" : "Создать"}
            </Button>
          </FormItem>
        </FormLayout>
      </Group>
      <Group>
        <SimpleCell
          onClick={() => {
            navigate(
              "else.competitions.create",
              {
                eventId,
              },
              { replace: true }
            );
          }}
        >
          Добавить конкурс
        </SimpleCell>
      </Group>
    </Panel>
  );
});
