import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import LiveStream from "./pages/live-stream-room";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "room",
          element: <LiveStream />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
