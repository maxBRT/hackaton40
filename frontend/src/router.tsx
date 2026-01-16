import { createBrowserRouter } from "react-router-dom";

import Layout from "./Layout";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LearningPaths from "./pages/LearningPaths";
import Course from "./pages/Course";
import ProtectedRoute from "./components/ProtectedRoute";
import ForumThreads from "./pages/ForumThreads.tsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forum", element: (
          <ProtectedRoute>
            <ForumThreads />
          </ProtectedRoute>
        )},

      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: "learning-paths",
        element: (
          <ProtectedRoute>
            <LearningPaths />
          </ProtectedRoute>
        ),
      },

      {
        path: "course/:id",
        element: (
          <ProtectedRoute>
            <Course />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
