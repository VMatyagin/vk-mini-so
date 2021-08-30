import { Route } from "router5";

export const eventPanels: Route[] = [
  {
    name: "create",
    path: "/create",
  },
  {
    name: "details",
    path: "/:id",
  },
  {
    name: "edit",
    path: "/:id/edit",
  },
  {
    name: "brigade-participants",
    path: "/:id/brigade-participants",
  },
];

export const routes: Route[] = [
  {
    // story
    name: "else",
    path: "/so",
    children: [
      {
        name: "base",
        path: "/",
        children: [
          {
            name: "base",
            path: ".",
          },
        ],
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
