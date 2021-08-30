import ReactDOM from "react-dom";
import { App } from "./App";
import "@vkontakte/vkui/dist/vkui.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { configureRouter } from "./create-router";
import { RouterProvider } from "react-router5";

const queryClient = new QueryClient();
const router = configureRouter(true);

router.start(() =>
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </QueryClientProvider>,
    document.getElementById("root")
  )
);
