import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Room from "./components/layout/Room";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "room",
          element: <Room />, 
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
