// Persist last subject/chapter choice - CBSE Worksheet Generator

const LAST_CHOICE_KEY = 'worksheet-last-subject-chapter';

export function saveLastChoice(subjectId, chapterId) {
    if (!subjectId || !chapterId) return;
    try {
        localStorage.setItem(LAST_CHOICE_KEY, JSON.stringify({ subjectId, chapterId }));
    } catch (_) {}
}

export function loadLastChoice() {
    try {
        const raw = localStorage.getItem(LAST_CHOICE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (_) {
        return null;
    }
}
