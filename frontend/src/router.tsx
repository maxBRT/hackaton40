import { createBrowserRouter } from "react-router-dom"

import Layout from "./Layout"
import App from "./App"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import LearningPaths from "./pages/LearningPaths"
import Course from "./pages/Course"
import LessonPage from "./pages/Lesson"
import ProtectedRoute from "./components/ProtectedRoute"
import ForumThreads from "./pages/ForumThreads"
import ForumPost from "./pages/ForumThreadDetails"
import PathDetails from "./pages/PathDetails"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

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
        path: "learning-path/:id",
        element: (
          <ProtectedRoute>
            <PathDetails />
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
        path: "lesson/:id",
        element: (
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "forum",
        element: (
          <ProtectedRoute>
            <ForumThreads />
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
    ],
  },
])
