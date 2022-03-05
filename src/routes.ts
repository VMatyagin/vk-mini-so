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
    path: "/competitions",
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
    path: "/competition/:competitionId",
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
  {
    name: "shtabs",
    path: "/shtabs",
    children: [
      {
        name: "base",
        path: "/",
      },
    ],
  },
  {
    name: "shtab",
    path: "/shtab/:shtabId",
    children: [
      {
        name: "details",
        path: "/",
      },
      {
        name: "edit",
        path: "/edit",
      },
    ],
  },
  {
    name: "reports",
    path: "/reports",
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
    name: "report",
    path: "/report/:reportId",
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
        name: "boec-list",
        path: "/boec-list",
      },
    ],
  },
  {
    name: "brigades",
    path: "/brigades",
    children: [
      {
        name: "base",
        path: "/",
      },
    ],
  },
  {
    name: "brigade",
    path: "/brigade/:brigadeId",
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
        name: "seasons-list",
        path: "/seasons-list",
      },
      {
        name: "seasons-requests-list",
        path: "/seasons-requests-list",
      },
    ],
  },
  {
    name: "boecs",
    path: "/boecs",
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
    name: "boec",
    path: "/boec/:boecId",
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
        name: "seasons",
        path: "/seasons",
      },
      {
        name: "history",
        path: "/history",
      },
    ],
  },
  {
    name: "poll",
    path: "/poll/:pollId",
    children: [
      {
        name: "base",
        path: "/",
      },
    ],
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
    name: "init",
    path: "/init",
    children: [
      {
        name: "onboarding",
        path: "/onboarding",
      },
      {
        name: "apply",
        path: "~/apply",
      },
    ],
  },
  {
    // story
    name: "else",
    path: "/spbso",
    children: elseViews,
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
