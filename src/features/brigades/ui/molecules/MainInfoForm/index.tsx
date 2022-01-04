import {
  Button,
  DatePicker,
  FormItem,
  FormLayout,
  Group,
  Header,
  Input,
  PanelSpinner,
  ScreenSpinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useRoute } from "react-router5";
import { routerStore } from "../../../../stores/router-store";
import { Brigade } from "../../../../types";
import { BrigadesAPI } from "../../../../utils/requests/brigades-request";

export const MainInfoForm: FC = observer(() => {
  const { openPopout, closePopout } = useContext(routerStore);
  const {
    route,
    router: { navigate },
  } = useRoute();

  const { brigadeId } = useMemo(() => route.params, [route]);
  const queryClient = useQueryClient();

  const { data: brigade } = useQuery({
    queryKey: ["brigade", brigadeId],
    queryFn: ({ queryKey }) => {
      openPopout(<ScreenSpinner />);
      return BrigadesAPI.getBrigade(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!brigadeId,
    onSuccess: closePopout,
  });

  const { handleSubmit, control, formState, reset } = useForm<Brigade>({
    defaultValues: { ...brigade! },
    mode: "onChange",
  });
  const { isDirty, isValid } = formState;

  const onSubmit = (values: Brigade) => {
    openPopout(<ScreenSpinner />);
    BrigadesAPI.updateBrigade({
      id: brigadeId!,
      title: values.title,
      dateOfBirth: values.dateOfBirth,
    }).then((data) => {
      queryClient.setQueryData(["brigade", brigadeId], data);
      closePopout();
      reset(data);
      navigate("else.brigade.details", { brigadeId }, { replace: true });
    });
  };

  return (
    <Group header={<Header mode="secondary">Информация об отряде</Header>}>
      {!brigade ? (
        <PanelSpinner />
      ) : (
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
            name="dateOfBirth"
            // rules={{ required: "Это поле необходимо заполнить" }}
            render={({ field }) => (
              <FormItem top="Дата рождения">
                <DatePicker
                  name={field.name}
                  min={{ day: 1, month: 1, year: 1901 }}
                  max={{
                    day: 1,
                    month: 1,
                    year: new Date().getFullYear(),
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
                  onDateChange={({ day, month, year }) => {
                    field.onChange(
                      new Date(year, month - 1, day).toISOString()
                    );
                  }}
                  dayPlaceholder="ДД"
                  monthPlaceholder="ММММ"
                  yearPlaceholder="ГГГГ"
                />
              </FormItem>
            )}
          />
          <FormItem>
            <Button
              type="submit"
              size="l"
              stretched={true}
              disabled={!isDirty || !isValid}
            >
              Сохранить
            </Button>
          </FormItem>
        </FormLayout>
      )}
    </Group>
  );
});
