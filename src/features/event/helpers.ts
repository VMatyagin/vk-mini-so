import { User } from "../types";

export const EVENT_WORTH = [
  {
    title: "Не учитывается",
  },
  {
    title: "Творчество",
  },
  {
    title: "Спорт",
  },
  {
    title: "Волонтерство",
  },
  {
    title: "Городское",
  },
];

export const PARTICIPANT_WORTH = [
  { title: "Участник" },
  { title: "Волонтер" },
  { title: "Организатор" },
];

export const PARTICIPANT_TITLES = [
  {
    title: "Участники",
  },
  { title: "Волонтеры" },
  { title: "Организаторы" },
];
export const COMPETITIVE_PARTICIPANT_TITLES = [
  {
    plural: "Непрошедших заявок",
    title: "Непрошедшие заявки",
  },
  {
    plural: "Прошло (участие или плей-офф)",
    title: "Прошли (участие или плей-офф)",
  },
  { plural: "Призовое место/номинация", title: "Призовое место/номинация" },
  { plural: "Безрейтинговых призовых", title: "Безрейтинговое призовое" },
];

export const canEditCompetitions = ({
  user,
  acceptedIds,
}: {
  user: User;
  acceptedIds: number[];
}) => {
  return (
    acceptedIds.filter((id) =>
      user!.shtabs.map((shtab) => shtab.id).includes(id)
    ).length > 0
  );
};
