import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import LiveStream from "./pages/live-stream-room";
import { lazy, Suspense } from "react";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import ProtectedRoute from "./ProtectedRoute";
import Error from "./pages/error";

const HomePage = lazy(() => import("./pages/home/index"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: (
            <Suspense>
              <HomePage /> {/* Render the Home component directly */}
            </Suspense>
          ),
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "room/:id",
      element: (
        <ProtectedRoute>
          <LiveStream />
        </ProtectedRoute>
      ),
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "signup",
      element: <Signup />,
    },
    {
      path: "error",
      element: <Error />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
