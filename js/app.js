// Main Application Controller
// CBSE Worksheet Generator - Grade 1

import { subjects, worksheetTypes, difficultyLevels } from './data.js';
import { buildPrompt } from './prompts.js';
import { downloadPDF, printWorksheet } from './pdf.js';

// ---------- State ----------
let state = {
    selectedSubject: null,
    selectedChapter: null,
    selectedType: 'practice',
    selectedDifficulty: 'medium',
    includeAnswers: false,
    worksheetData: null,
};

// ---------- DOM Elements ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Steps
const stepSubjects = $('#stepSubjects');
const stepChapters = $('#stepChapters');
const stepOptions = $('#stepOptions');
const stepWorksheet = $('#stepWorksheet');

// Controls
const subjectGrid = $('#subjectGrid');
const chapterList = $('#chapterList');
const typeCards = $('#typeCards');
const difficultyCards = $('#difficultyCards');
const generateBtn = $('#generateBtn');
const printBtn = $('#printBtn');
const downloadBtn = $('#downloadBtn');
const regenerateBtn = $('#regenerateBtn');
const includeAnswersToggle = $('#includeAnswers');

// Display
const worksheetContainer = $('#worksheetContainer');
const loadingOverlay = $('#loadingOverlay');
const loadingTip = $('#loadingTip');
const errorModal = $('#errorModal');

// Navigation
const backToSubjects = $('#backToSubjects');
const backToChapters = $('#backToChapters');
const backToOptions = $('#backToOptions');
const themeToggle = $('#themeToggle');

// ---------- Loading Tips ----------
const loadingTips = [
    'AI is crafting perfect questions for your exam prep! ✨',
    'Making sure every question matches your school pattern... 📋',
    'Adding fun and learning together! 🎮',
    'Almost there... preparing a printable worksheet! 🖨️',
    'Checking difficulty level and question variety... 📊',
    'Creating age-appropriate content for Grade 1... 🧒',
    'This usually takes 10-15 seconds... ⏳',
];

// ---------- Initialize ----------
function init() {
    renderSubjects();
    renderTypeCards();
    renderDifficultyCards();
    attachEventListeners();
    loadTheme();
}

// ---------- Render Functions ----------

function renderSubjects() {
    subjectGrid.innerHTML = subjects
        .map(
            (subject) => `
    <div class="subject-card" data-subject-id="${subject.id}" 
         style="--subject-color: ${subject.color}; --subject-gradient: ${subject.gradient};">
      <span class="subject-card-icon">${subject.icon}</span>
      <div class="subject-card-name">${subject.name}</div>
      <div class="subject-card-desc">${subject.description}</div>
      <div class="subject-card-chapters">📚 ${subject.chapters.length} chapters</div>
    </div>
  `
        )
        .join('');
}

function renderChapters(subject) {
    const selectedSubjectTitle = $('#selectedSubjectTitle');
    selectedSubjectTitle.textContent = `${subject.icon} ${subject.name}`;

    chapterList.innerHTML = subject.chapters
        .map(
            (chapter, index) => `
    <div class="chapter-card" data-chapter-id="${chapter.id}"
         style="--subject-color: ${subject.color}; --subject-gradient: ${subject.gradient};">
      <div class="chapter-number">${index + 1}</div>
      <div class="chapter-info">
        <div class="chapter-name">${chapter.name}</div>
        <div class="chapter-type">${chapter.type}</div>
      </div>
      <span class="chapter-arrow">→</span>
    </div>
  `
        )
        .join('');
}

function renderTypeCards() {
    typeCards.innerHTML = worksheetTypes
        .map(
            (type) => `
    <div class="option-card ${type.id === state.selectedType ? 'selected' : ''}" data-type-id="${type.id}">
      <span class="option-card-icon">${type.icon}</span>
      <div class="option-card-name">${type.name}</div>
      <div class="option-card-desc">${type.description}</div>
    </div>
  `
        )
        .join('');
}

function renderDifficultyCards() {
    difficultyCards.innerHTML = difficultyLevels
        .map(
            (level) => `
    <div class="option-card ${level.id === state.selectedDifficulty ? 'selected' : ''}" data-difficulty-id="${level.id}">
      <span class="option-card-icon">${level.icon}</span>
      <div class="option-card-name">${level.name}</div>
      <div class="option-card-desc">${level.description}</div>
    </div>
  `
        )
        .join('');
}

// ---------- Worksheet Rendering ----------

function renderWorksheet(data) {
    const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    let html = `
    <div class="worksheet-school-header">
      <div class="worksheet-school-name">📚 CBSE Grade 1 — Cambridge Shades</div>
      <div class="worksheet-meta">
        <span>Subject: ${data.subject || state.selectedSubject.name}</span>
        <span>Total Marks: ${data.totalMarks || 15}</span>
      </div>
    </div>

    <div class="worksheet-title">${data.title || state.selectedChapter.name}</div>

    <div class="worksheet-info-row">
      <div><label>Student Name:</label> <span class="line"></span></div>
      <div><label>Date:</label> ${today}</div>
      <div><label>Roll No:</label> <span class="line"></span></div>
    </div>
  `;

    // Render each section
    if (data.sections && Array.isArray(data.sections)) {
        data.sections.forEach((section, sIndex) => {
            html += renderSection(section, sIndex);
        });
    }

    // Bonus activity
    if (data.bonusActivity) {
        html += `
      <div class="worksheet-bonus">
        <h4>⭐ Bonus Activity</h4>
        <p>${data.bonusActivity}</p>
      </div>
    `;
    }

    // Answer key
    if (state.includeAnswers && data.sections) {
        html += renderAnswerKey(data.sections);
    }

    worksheetContainer.innerHTML = html;
}

function renderSection(section, sectionIndex) {
    const sectionNum = toRoman(sectionIndex + 1);
    let html = `
    <div class="worksheet-section">
      <div class="worksheet-section-header">
        <span class="worksheet-section-title">${sectionNum}. ${section.title || 'Section'}</span>
        <span class="worksheet-section-marks">${section.marks || ''}</span>
      </div>
  `;

    if (section.instruction) {
        html += `<div class="worksheet-instruction">${section.instruction}</div>`;
    }

    const type = (section.type || '').toLowerCase();

    switch (type) {
        case 'mcq':
            html += renderMCQ(section.questions);
            break;
        case 'match':
            html += renderMatch(section.questions);
            break;
        case 'true_false':
            html += renderTrueFalse(section.questions);
            break;
        case 'fill_blanks':
            html += renderFillBlanks(section.questions);
            break;
        default:
            html += renderGenericQuestions(section.questions, type);
            break;
    }

    html += `</div>`;
    return html;
}

function renderMCQ(questions) {
    if (!questions || !Array.isArray(questions)) return '';
    return questions
        .map(
            (q, i) => `
    <div class="worksheet-question">
      <span class="q-number">${i + 1}.</span> ${q.question}
      ${q.options
                    ? `<div class="worksheet-mcq-options">
          ${q.options.map((opt, oi) => `<span>${String.fromCharCode(97 + oi)}) ${opt}</span>`).join('')}
        </div>`
                    : ''
                }
    </div>
  `
        )
        .join('');
}

function renderMatch(questions) {
    if (!questions || !Array.isArray(questions)) return '';
    // Check if first question has matchLeft/matchRight arrays
    const q = questions[0];
    if (q && q.matchLeft && q.matchRight) {
        let html = `<table class="worksheet-match-table">
      <thead><tr><th>Column A</th><th>Column B</th></tr></thead>
      <tbody>`;
        const maxLen = Math.max(q.matchLeft.length, q.matchRight.length);
        for (let i = 0; i < maxLen; i++) {
            html += `<tr>
        <td>${i + 1}. ${q.matchLeft[i] || ''}</td>
        <td>${String.fromCharCode(97 + i)}. ${q.matchRight[i] || ''}</td>
      </tr>`;
        }
        html += `</tbody></table>`;
        return html;
    }
    // Fallback: individual match questions
    return questions
        .map(
            (item, i) => `
    <div class="worksheet-question">
      <span class="q-number">${i + 1}.</span> ${item.question || ''}
      <span class="worksheet-answer-line"></span>
    </div>
  `
        )
        .join('');
}

function renderTrueFalse(questions) {
    if (!questions || !Array.isArray(questions)) return '';
    return questions
        .map(
            (q, i) => `
    <div class="worksheet-tf-item">
      <span><span class="q-number">${i + 1}.</span> ${q.question}</span>
      <span class="worksheet-tf-brackets">( __________ )</span>
    </div>
  `
        )
        .join('');
}

function renderFillBlanks(questions) {
    if (!questions || !Array.isArray(questions)) return '';
    return questions
        .map(
            (q, i) => `
    <div class="worksheet-question">
      <span class="q-number">${i + 1}.</span> ${q.question}
    </div>
  `
        )
        .join('');
}

function renderGenericQuestions(questions, type) {
    if (!questions || !Array.isArray(questions)) return '';
    const needsLines =
        type === 'meanings' ||
        type === 'one_line' ||
        type === 'short_answer' ||
        type === 'sentence_rewrite' ||
        type === 'rhyming' ||
        type === 'singular_plural' ||
        type === 'counting' ||
        type === 'word_problem' ||
        type === 'scenario' ||
        type === 'picture_describe';

    return questions
        .map(
            (q, i) => `
    <div class="worksheet-question">
      <span class="q-number">${i + 1}.</span> ${q.question}
      ${needsLines
                    ? `<div class="worksheet-answer-lines">
          <span class="worksheet-answer-line"></span>
          <span class="worksheet-answer-line"></span>
        </div>`
                    : ''
                }
    </div>
  `
        )
        .join('');
}

function renderAnswerKey(sections) {
    let html = `<div class="worksheet-answer-key"><h3>📝 Answer Key</h3>`;

    sections.forEach((section, si) => {
        const hasAnswers = section.questions?.some((q) => q.answer);
        if (!hasAnswers) return;

        html += `<div style="margin-bottom: 12px;"><strong>${toRoman(si + 1)}. ${section.title}</strong></div>`;
        section.questions.forEach((q, qi) => {
            if (q.answer) {
                html += `<div class="answer-item">${qi + 1}. ${q.answer}</div>`;
            }
        });
    });

    html += `</div>`;
    return html;
}

function toRoman(num) {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romanNumerals[num - 1] || num;
}

// ---------- Navigation ----------

function showStep(stepEl) {
    $$('.step').forEach((s) => s.classList.remove('step-active'));
    stepEl.classList.add('step-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- API Call ----------

async function generateWorksheet() {
    const prompt = buildPrompt(
        state.selectedSubject,
        state.selectedChapter,
        state.selectedType,
        state.selectedDifficulty,
        state.includeAnswers
    );

    showLoading(true);

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || `Server error: ${response.status}`);
        }

        const data = await response.json();

        if (data.worksheet) {
            state.worksheetData = data.worksheet;
            renderWorksheet(data.worksheet);
            showStep(stepWorksheet);
        } else if (data.raw) {
            // Try to render raw text as a simple worksheet
            state.worksheetData = { title: state.selectedChapter.name, raw: data.raw };
            worksheetContainer.innerHTML = `
        <div class="worksheet-school-header">
          <div class="worksheet-school-name">📚 CBSE Grade 1 — Cambridge Shades</div>
        </div>
        <div class="worksheet-title">${state.selectedChapter.name}</div>
        <div style="white-space: pre-wrap; font-size: 0.9rem; line-height: 1.8;">${data.raw}</div>
      `;
            showStep(stepWorksheet);
        } else {
            throw new Error('No worksheet data received');
        }
    } catch (error) {
        console.error('Generation failed:', error);
        showError('Generation Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
        showLoading(false);
    }
}

// ---------- UI Helpers ----------

function showLoading(show) {
    if (show) {
        loadingTip.textContent = loadingTips[Math.floor(Math.random() * loadingTips.length)];
        loadingOverlay.classList.add('active');
        // Rotate tips
        const tipInterval = setInterval(() => {
            if (!loadingOverlay.classList.contains('active')) {
                clearInterval(tipInterval);
                return;
            }
            loadingTip.textContent = loadingTips[Math.floor(Math.random() * loadingTips.length)];
        }, 3000);
    } else {
        loadingOverlay.classList.remove('active');
    }
}

function showError(title, message) {
    $('#errorTitle').textContent = title;
    $('#errorMessage').textContent = message;
    errorModal.classList.add('active');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('worksheet-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('worksheet-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// ---------- Event Listeners ----------

function attachEventListeners() {
    // Subject selection
    subjectGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.subject-card');
        if (!card) return;
        const subjectId = card.dataset.subjectId;
        state.selectedSubject = subjects.find((s) => s.id === subjectId);
        if (state.selectedSubject) {
            renderChapters(state.selectedSubject);
            showStep(stepChapters);
        }
    });

    // Chapter selection
    chapterList.addEventListener('click', (e) => {
        const card = e.target.closest('.chapter-card');
        if (!card) return;
        const chapterId = card.dataset.chapterId;
        state.selectedChapter = state.selectedSubject.chapters.find((c) => c.id === chapterId);
        if (state.selectedChapter) {
            const selectedChapterTitle = $('#selectedChapterTitle');
            selectedChapterTitle.textContent = `${state.selectedSubject.icon} ${state.selectedSubject.name} → ${state.selectedChapter.name}`;
            showStep(stepOptions);
        }
    });

    // Type selection
    typeCards.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;
        state.selectedType = card.dataset.typeId;
        typeCards.querySelectorAll('.option-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
    });

    // Difficulty selection
    difficultyCards.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;
        state.selectedDifficulty = card.dataset.difficultyId;
        difficultyCards.querySelectorAll('.option-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
    });

    // Include answers toggle
    includeAnswersToggle.addEventListener('change', () => {
        state.includeAnswers = includeAnswersToggle.checked;
    });

    // Generate
    generateBtn.addEventListener('click', generateWorksheet);
    regenerateBtn.addEventListener('click', generateWorksheet);

    // Print & Download
    printBtn.addEventListener('click', printWorksheet);
    downloadBtn.addEventListener('click', async () => {
        const filename = `${state.selectedSubject?.name || 'worksheet'}_${state.selectedChapter?.name || 'chapter'}_${state.selectedType}.pdf`
            .replace(/\s+/g, '_')
            .toLowerCase();
        try {
            await downloadPDF(worksheetContainer, filename);
        } catch (err) {
            showError('PDF Error', 'Could not generate PDF. Try using the Print button instead.');
        }
    });

    // Navigation
    backToSubjects.addEventListener('click', () => showStep(stepSubjects));
    backToChapters.addEventListener('click', () => showStep(stepChapters));
    backToOptions.addEventListener('click', () => showStep(stepOptions));

    // Theme
    themeToggle.addEventListener('click', toggleTheme);

    // Error modal close
    $('#errorClose').addEventListener('click', () => errorModal.classList.remove('active'));

    // Close modal on backdrop click
    errorModal.addEventListener('click', (e) => {
        if (e.target === errorModal) errorModal.classList.remove('active');
    });
}

// ---------- Boot ----------
document.addEventListener('DOMContentLoaded', init);
