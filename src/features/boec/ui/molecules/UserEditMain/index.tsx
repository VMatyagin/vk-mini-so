import {
  Button,
  DatePicker,
  FormItem,
  FormLayout,
  Group,
  Input,
  ScreenSpinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import React, { FC, useContext, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";

import { SuccessSnackbar } from "../../../../../ui/molecules/SuccessSnackbar";
import { routerStore } from "../../../../stores/router-store";
import { Boec } from "../../../../types";
import { UsersAPI } from "../../../../utils/requests/user-request";
import { useQueryClient } from "react-query";
import { useRoute } from "react-router5";
import { ReportAPI } from "../../../../utils/requests/reports-requests";

export const UserEditMain: FC = observer(() => {
  const { openPopout, closePopout } = useContext(routerStore);
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { boecId, reportId } = useMemo(() => route.params, [route]);

  const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);
  const queryClient = useQueryClient();

  const { data: boec } = useQuery<Boec>({
    queryKey: ["boec", boecId],
    queryFn: ({ queryKey }) => {
      return UsersAPI.getUserData(queryKey[1] as string);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!boecId,
  });

  const { handleSubmit, control, formState, reset } = useForm<Boec>({
    defaultValues: boec,
    mode: "onChange",
  });

  const { isDirty, isValid } = formState;

  const onSubmit = (values: Boec) => {
    openPopout(<ScreenSpinner />);
    if (boecId) {
      UsersAPI.updateBoecData(values).then(({ data }) => {
        queryClient.setQueryData(["boec", boecId!], data);
        closePopout();
        reset(data);
        setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
      });
    } else {
      UsersAPI.createBoec({ ...values }).then(async (boec) => {
        if (reportId) {
          await ReportAPI.createSeason(reportId, {
            boecId: boec.id,
            state: "rejected",
          });
          navigate(
            "else.report.boec-list",
            {
              reportId,
            },
            { replace: true }
          );
        } else {
          navigate("else.boec.details", { boecId: boec.id });
          reset(boec);
          setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
        }
        closePopout();
      });
    }
  };
  return (
    <Group>
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="lastName"
          rules={{ required: "Это поле необходимо заполнить" }}
          render={({ field, fieldState }) => (
            <FormItem
              top="Фамилия"
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
          name="firstName"
          rules={{ required: "Это поле необходимо заполнить" }}
          render={({ field, fieldState }) => (
            <FormItem
              top="Имя"
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
          name="middleName"
          // rules={{ required: "Это поле необходимо заполнить" }}
          render={({ field, fieldState }) => (
            <FormItem
              top="Отчество"
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
                  year: new Date().getFullYear() - 18,
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
                  field.onChange(`${year}-${month}-${day}`);
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
            size="l"
            stretched={true}
            disabled={!isDirty || !isValid}
            type="submit"
          >
            Сохранить
          </Button>
        </FormItem>
      </FormLayout>
      {SnackBar}
    </Group>
  );
});
