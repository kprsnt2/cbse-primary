// Event listeners - CBSE Worksheet Generator

import { state } from './state.js';
import { subjects } from './data.js';
import { downloadPDF } from './pdf.js';
import { saveLastChoice } from './storage.js';

export function attachEventListeners(deps) {
    const {
        $,
        subjectGrid,
        chapterList,
        typeCards,
        difficultyCards,
        generateBtn,
        regenerateBtn,
        includeAnswersToggle,
        worksheetContainer,
        printBtn,
        downloadBtn,
        backToSubjects,
        backToChapters,
        backToOptions,
        themeToggle,
        errorModal,
        renderSubjects,
        renderChapters,
        renderTypeCards,
        renderDifficultyCards,
        showStep,
        generateWorksheet,
        printWorksheet,
        showError,
        closeErrorModal,
        stepSubjects,
        stepChapters,
        stepOptions,
    } = deps;

    subjectGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.subject-card');
        if (!card) return;
        const subjectId = card.dataset.subjectId;
        state.selectedSubject = subjects.find((s) => s.id === subjectId);
        if (state.selectedSubject) {
            renderChapters(state.selectedSubject, chapterList, $('#selectedSubjectTitle'));
            showStep(stepChapters);
        }
    });

    chapterList.addEventListener('click', (e) => {
        const card = e.target.closest('.chapter-card');
        if (!card) return;
        const chapterId = card.dataset.chapterId;
        state.selectedChapter = state.selectedSubject.chapters.find((c) => c.id === chapterId);
        if (state.selectedChapter) {
            $('#selectedChapterTitle').textContent = `${state.selectedSubject.icon} ${state.selectedSubject.name} → ${state.selectedChapter.name}`;
            showStep(stepOptions);
            saveLastChoice(state.selectedSubject.id, state.selectedChapter.id);
        }
    });

    typeCards.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;
        state.selectedType = card.dataset.typeId;
        typeCards.querySelectorAll('.option-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
    });

    difficultyCards.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;
        state.selectedDifficulty = card.dataset.difficultyId;
        difficultyCards.querySelectorAll('.option-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
    });

    includeAnswersToggle.addEventListener('change', () => {
        state.includeAnswers = includeAnswersToggle.checked;
    });

    generateBtn.addEventListener('click', generateWorksheet);
    regenerateBtn.addEventListener('click', generateWorksheet);

    printBtn.addEventListener('click', printWorksheet);
    downloadBtn.addEventListener('click', async () => {
        const filename = `${state.selectedSubject?.name || 'worksheet'}_${state.selectedChapter?.name || 'chapter'}_${state.selectedType}.pdf`
            .replace(/\s+/g, '_')
            .toLowerCase();
        try {
            await downloadPDF(worksheetContainer, filename);
            if (deps.showToast) deps.showToast('PDF downloaded');
        } catch (err) {
            showError('PDF Error', 'Could not generate PDF. Try using the Print button instead.');
        }
    });

    backToSubjects.addEventListener('click', () => showStep(stepSubjects));
    backToChapters.addEventListener('click', () => showStep(stepChapters));
    backToOptions.addEventListener('click', () => showStep(stepOptions));

    themeToggle.addEventListener('click', () => deps.toggleTheme());

    $('#errorClose').addEventListener('click', closeErrorModal);
    if (deps.errorRetryBtn) {
        deps.errorRetryBtn.addEventListener('click', () => {
            closeErrorModal();
            generateWorksheet();
        });
    }

    errorModal.addEventListener('click', (e) => {
        if (e.target === errorModal) closeErrorModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && errorModal.classList.contains('active')) closeErrorModal();
    });

    subjectGrid.addEventListener('keydown', (e) => {
        const card = e.target.closest('.subject-card');
        if (!card || (e.key !== 'Enter' && e.key !== ' ')) return;
        e.preventDefault();
        const subjectId = card.dataset.subjectId;
        state.selectedSubject = subjects.find((s) => s.id === subjectId);
        if (state.selectedSubject) {
            renderChapters(state.selectedSubject, chapterList, $('#selectedSubjectTitle'));
            showStep(stepChapters);
        }
    });

    chapterList.addEventListener('keydown', (e) => {
        const card = e.target.closest('.chapter-card');
        if (!card || (e.key !== 'Enter' && e.key !== ' ')) return;
        e.preventDefault();
        const chapterId = card.dataset.chapterId;
        state.selectedChapter = state.selectedSubject.chapters.find((c) => c.id === chapterId);
        if (state.selectedChapter) {
            $('#selectedChapterTitle').textContent = `${state.selectedSubject.icon} ${state.selectedSubject.name} → ${state.selectedChapter.name}`;
            showStep(stepOptions);
        }
    });
}
