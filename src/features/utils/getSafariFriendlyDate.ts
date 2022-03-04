import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ru";

dayjs.extend(customParseFormat);

export const getSafariFriendlyDate = (
  value: dayjs.ConfigType,
  format: string = "YYYY-MM-DDTHH:mm:ss.000ZZ"
) => dayjs(value, format).locale("ru");
