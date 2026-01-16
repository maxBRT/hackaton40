import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, 'backend/src/prisma/data');

function multiplyData(filename: string, factor: number) {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!Array.isArray(data)) {
        console.error(`Data is not an array in ${filename}`);
        return;
    }

    const originalLength = data.length;
    const newData = [...data];

    for (let i = 1; i < factor; i++) {
        data.forEach((item: any) => {
            const newItem = { ...item };
            
            // Handle ID uniqueness
            if (newItem.id) {
                newItem.id = `${newItem.id}_${i}`;
            }

            // Specific logic for different types
            if (filename === 'users.json') {
                if (newItem.username) newItem.username = `${newItem.username}_${i}`;
                if (newItem.email) newItem.email = newItem.email.replace('@', `${i}@`);
            } else if (filename === 'forumThreads.json') {
                if (newItem.userId && i > 0) {
                     // Optionally rotate users if we want more variety, 
                     // but keeping original userId is safer for relational integrity 
                     // UNLESS we also multiplied users.
                }
            } else if (filename === 'forumPosts.json') {
                if (newItem.threadId && !newItem.threadId.endsWith(`_${i}`)) {
                    // This is tricky: do we want more posts per thread, or more threads with posts?
                    // If we multiplied threads, we should probably point some posts to new threads.
                    newItem.threadId = `${newItem.threadId}_${i}`;
                }
            } else if (filename === 'lessons.json') {
                if (newItem.moduleId) newItem.moduleId = `${newItem.moduleId}_${i}`;
            } else if (filename === 'modules.json') {
                if (newItem.courseId) newItem.courseId = `${newItem.courseId}_${i}`;
            } else if (filename === 'courses.json') {
                if (newItem.learningPathId) newItem.learningPathId = `${newItem.learningPathId}_${i}`;
            } else if (filename === 'quizzes.json') {
                if (newItem.lessonId) newItem.lessonId = `${newItem.lessonId}_${i}`;
            } else if (filename === 'questions.json') {
                if (newItem.quizId) newItem.quizId = `${newItem.quizId}_${i}`;
            } else if (filename === 'courseUsers.json') {
                if (newItem.userId) newItem.userId = `${newItem.userId}_${i}`;
                if (newItem.courseId) newItem.courseId = `${newItem.courseId}_${i}`;
            } else if (filename === 'lessonProgresses.json') {
                if (newItem.userId) newItem.userId = `${newItem.userId}_${i}`;
                if (newItem.lessonId) newItem.lessonId = `${newItem.lessonId}_${i}`;
            }

            newData.push(newItem);
        });
    }

    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    console.log(`Multiplied ${filename}: ${originalLength} -> ${newData.length}`);
}

const filesToMultiply = [
    'users.json',
    'learningPaths.json',
    'courses.json',
    'modules.json',
    'lessons.json',
    'quizzes.json',
    'questions.json',
    'courseUsers.json',
    'lessonProgresses.json',
    'forumThreads.json',
    'forumPosts.json'
];

filesToMultiply.forEach(file => multiplyData(file, 4));
