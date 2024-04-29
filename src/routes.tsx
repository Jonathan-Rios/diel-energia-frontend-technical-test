import { createBrowserRouter } from "react-router-dom";

import { Daily } from "./pages/Daily";
import { Weekly } from "./pages/Weekly";
import { Monthly } from "./pages/Monthly";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Daily />,
  },
  {
    path: "/weekly",
    element: <Weekly />,
  },
  {
    path: "/monthly",
    element: <Monthly />,
  },
]);
