import "./styles/global.css";
import "react-toastify/dist/ReactToastify.css";

import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Loading } from "@/components/Loading";
import { AppProvider } from "@/context";
import { router } from "@/routes";

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <ToastContainer />
      <Loading />
    </AppProvider>
  );
}

export default App;
