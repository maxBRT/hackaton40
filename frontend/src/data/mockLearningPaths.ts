export type LearningPath = {
  id: string;
  title: string;
  description: string;
};

export type Course = {
  id: string;
  pathId: string; // lien vers LearningPath.id
  title: string;
  description: string;
};

export const learningPaths: LearningPath[] = [
  {
    id: "web-fondations",
    title: "Fondations Web",
    description: "HTML, CSS, JavaScript et bases du web moderne.",
  },
  {
    id: "react-debutant",
    title: "React Débutant",
    description: "Composants, props/state, routing et bonnes pratiques.",
  },
];

export const courses: Course[] = [
  {
    id: "course-html-css",
    pathId: "web-fondations",
    title: "HTML & CSS",
    description: "Structure des pages, layout, responsive, bonnes pratiques.",
  },
  {
    id: "course-js",
    pathId: "web-fondations",
    title: "JavaScript",
    description: "Variables, fonctions, DOM, fetch, bases solides.",
  },
  {
    id: "course-react-basics",
    pathId: "react-debutant",
    title: "React Basics",
    description: "JSX, composants, props/state, events.",
  },
  {
    id: "course-react-router",
    pathId: "react-debutant",
    title: "React Router",
    description: "Routes, params, navigation, pages protégées.",
  },
];
