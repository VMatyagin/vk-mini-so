export const getDateString = (date?: string | null, time?: string | null) => {
  if (!date) {
    return "";
  }
  return `${new Date(date).toLocaleString("ru", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  })} ${time ? time?.slice(0, -3) : ""}`;
};
