import { Route } from "router5";

const elseViews: Route[] = [
  {
    name: "base",
    path: "/",
    children: [
      {
        name: "base",
        path: "/",
      },
    ],
  },
  {
    name: "events",
    path: "/events",
    children: [
      {
        name: "base",
        path: "/",
      },
      {
        name: "create",
        path: "/create",
      },
    ],
  },
  {
    name: "event",
    path: "/event/:eventId",
    children: [
      {
        name: "details",
        path: "/",
      },
      {
        name: "edit",
        path: "/edit",
      },
      {
        name: "brigade-participants",
        path: "/brigade-participants",
      },
      {
        name: "organizers",
        path: "/organizers",
      },
      {
        name: "volonteers",
        path: "/volonteers",
      },
      {
        name: "participants",
        path: "/participants",
      },
      {
        name: "quotas",
        path: "/quotas",
      },
    ],
  },
  {
    name: "competitions",
    path: "/event/:eventId/competitions",
    children: [
      {
        name: "base",
        path: "/",
      },
      {
        name: "create",
        path: "/create",
      },
    ],
  },
  {
    name: "competition",
    path: "/event/:eventId/competition/:competitionId",
    children: [
      {
        name: "details",
        path: "/",
      },
      {
        name: "edit",
        path: "/edit",
      },
      {
        name: "participants",
        path: "/participants",
      },
      {
        name: "involvements",
        path: "/involvements",
      },
      {
        name: "winners",
        path: "/winners",
      },
      {
        name: "not-winners",
        path: "/not-winners",
      },
      {
        name: "nominations",
        path: "/nominations",
      },
    ],
  },
];

export const getElseViewPanel = (
  viewName: string,
  panelName: string,
  defaultPanel: string
): string =>
  elseViews
    .find((view) => view.name === viewName)
    ?.children?.map((panel) => panel.name)
    .includes(panelName)
    ? panelName
    : defaultPanel;
export const routes: Route[] = [
  {
    // story
    name: "else",
    path: "/spbso",
    children: elseViews,
  },
  {
    name: "profile",
    path: "/profile",
    children: [
      {
        name: "notifications",
        path: "/notifications",
      },
    ],
  },
  {
    name: "scanner",
    path: "/scanner",
    children: [
      {
        name: "scan",
        path: "/scan",
      },
    ],
  },
];
