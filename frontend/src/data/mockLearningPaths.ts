export type LearningPath = {
  id: string;
  title: string;
  description: string;
};

export type Course = {
  id: string;
  pathId: string;
  title: string;
  description: string;
};

export type Module = {
  id: string;
  courseId: string;
  title: string;
  position: number;
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  position: number;
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

export const modules: Module[] = [
  {
    id: "mod-html-basics",
    courseId: "course-html-css",
    title: "Bases HTML",
    position: 1,
  },
  {
    id: "mod-css-basics",
    courseId: "course-html-css",
    title: "Bases CSS",
    position: 2,
  },
  {
    id: "mod-js-basics",
    courseId: "course-js",
    title: "Bases JavaScript",
    position: 1,
  },
  {
    id: "mod-react-basics",
    courseId: "course-react-basics",
    title: "Démarrer avec React",
    position: 1,
  },
];

export const lessons: Lesson[] = [
  {
    id: "lesson-html-tags",
    moduleId: "mod-html-basics",
    title: "Les balises HTML",
    position: 1,
  },
  {
    id: "lesson-html-forms",
    moduleId: "mod-html-basics",
    title: "Formulaires HTML",
    position: 2,
  },
  {
    id: "lesson-css-selectors",
    moduleId: "mod-css-basics",
    title: "Sélecteurs CSS",
    position: 1,
  },
  {
    id: "lesson-css-flex",
    moduleId: "mod-css-basics",
    title: "Flexbox",
    position: 2,
  },
  {
    id: "lesson-js-vars",
    moduleId: "mod-js-basics",
    title: "Variables & types",
    position: 1,
  },
  {
    id: "lesson-js-functions",
    moduleId: "mod-js-basics",
    title: "Fonctions",
    position: 2,
  },
  {
    id: "lesson-react-components",
    moduleId: "mod-react-basics",
    title: "Composants",
    position: 1,
  },
  {
    id: "lesson-react-state",
    moduleId: "mod-react-basics",
    title: "State & props",
    position: 2,
  },
];
