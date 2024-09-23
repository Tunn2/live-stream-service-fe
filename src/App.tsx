import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import LiveStream from "./pages/live-stream-room";
import { lazy, Suspense } from "react";
import Login from "./pages/login";
import Signup from "./pages/signup";

const HomePage = lazy(() => import("./pages/home/index"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <Suspense>
              <HomePage /> {/* Render the Home component directly */}
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "room/:id",
      element: <LiveStream />,
    },
    {
      path: "login",
      element: <Login/>,
    },
    {
      path: "signup",
      element: <Signup/>,
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App;
