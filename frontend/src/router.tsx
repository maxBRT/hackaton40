import { createBrowserRouter } from "react-router-dom";

import Layout from "./Layout";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LearningPaths from "./pages/LearningPaths";
import Course from "./pages/Course.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ForumThreads from "./pages/ForumThreads.tsx";
import ForumPost from "@/pages/ForumThreadDetails.tsx";
import PathDetails from "./pages/PathDetails.tsx";
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
      {
        path: "forum/:id",
        element: (
          <ProtectedRoute>
            <ForumPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "learning-path/:id",
        element: (
          <ProtectedRoute>
            <PathDetails/>
          </ProtectedRoute>
        ),
      }  
      
    ],
  },
]);
