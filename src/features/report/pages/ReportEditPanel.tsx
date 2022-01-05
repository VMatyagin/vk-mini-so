import { FC, useContext, useMemo } from "react";
import {
  Panel,
  PanelHeaderBack,
  Title,
  PanelProps,
  Button,
  FormItem,
  FormLayout,
  Input,
  PanelSpinner,
  ScreenSpinner,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient, useQuery, useMutation } from "react-query";
import { useRoute } from "react-router5";
import { routerStore } from "../../stores/router-store";
import { SeasonReport } from "../../types";
import { dirtyValues } from "../../utils";
import { ReportAPI } from "../../utils/requests/reports-requests";

export const ReportEditPanel: FC<PanelProps> = observer((props) => {
  const { openPopout, closePopout } = useContext(routerStore);
  const queryClient = useQueryClient();
  const { route } = useRoute();

  const { reportId, brigadeId } = useMemo(() => route.params, [route]);

  const { handleSubmit, control, formState, reset } = useForm<SeasonReport>({
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const { isLoading: isReportLoading } = useQuery<SeasonReport>({
    queryKey: ["season-report", reportId!],
    queryFn: ({ queryKey }) => {
      return ReportAPI.getReport(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!reportId,
    onSuccess: (data) => reset(data),
  });

  const { isDirty, isValid, dirtyFields } = formState;

  const { mutate, isLoading } = useMutation(
    (values: SeasonReport) => {
      openPopout(<ScreenSpinner />);
      if (reportId) {
        return ReportAPI.updateReport(
          reportId,
          dirtyValues(dirtyFields, values)
        );
      }
      return ReportAPI.createReport({ ...values, brigadeId });
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["season-report", reportId], data);

        closePopout();
        window.history.back();
      },
      onError: () => {
        closePopout();
      },
    }
  );
  const onSubmit = (values: SeasonReport) => {
    mutate(values);
  };

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          {reportId ? "Редактирование отчета" : "Создать отчет"}
        </Title>
      </PanelHeader>
      {isReportLoading ? (
        <PanelSpinner />
      ) : (
        <FormLayout onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="employer"
            defaultValue=""
            rules={{ required: "Это поле необходимо заполнить" }}
            render={({ field, fieldState }) => (
              <FormItem
                top="Работодатель"
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState?.error?.message}
              >
                <Input
                  type="text"
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name="year"
            rules={{
              required: "Это поле необходимо заполнить",
              max: new Date().getFullYear(),
              min: 2000,
            }}
            render={({ field, fieldState }) => (
              <FormItem
                top="Год"
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState?.error?.message}
              >
                <Input
                  type="number"
                  placeholder="Не указан"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  max={new Date().getFullYear()}
                  min={2000}
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
              {reportId ? "Сохранить" : "Создать"}
            </Button>
          </FormItem>
        </FormLayout>
      )}
    </Panel>
  );
});
