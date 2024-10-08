import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import LiveStream from "./pages/live-stream-room";
import { lazy, Suspense } from "react";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import ProtectedRoute from "./ProtectedRoute";
import Error from "./pages/error";
import Category from "./pages/category";
import Verify from "./pages/verify";
import VerifyFail from "./pages/verify/fail";
import VerifySuccess from "./pages/verify/success";
import Search from "./pages/search";
import AdvanceSearch from "./pages/advance-search";
import ResetPassword from "./pages/resetPassword";
import ForgetPassword from "./pages/forget-password";

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
          path: "profile/:userId",
          element: <Profile />,
        },
        {
          path: "/category/:category",
          element: <Category />,
        },
        {
          path: "room/:id",
          element: <LiveStream />,
        },
        {
          path: "/search/:searchQuery",
          element: <Search />,
        },
        {
          path: "/search/",
          element: <Search />,
        },
        {
          path: "/advance-search/",
          element: <AdvanceSearch />,
        },
      ],
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
      path: "verify",
      element: <Verify />,
    },
    {
      path: "verify/success",
      element: <VerifySuccess />,
    },
    {
      path: "verify/fail",
      element: <VerifyFail />,
    },
    {
      path: "reset-password/:token",
      element: <ResetPassword />,
    },
    {
      path: "forget-password",
      element: <ForgetPassword />,
    },
    {
      path: "error",
      element: <Error />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
