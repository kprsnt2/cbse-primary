// Render functions and worksheet HTML - CBSE Worksheet Generator

import DOMPurify from 'dompurify';
import { state } from './state.js';
import { subjects, worksheetTypes, difficultyLevels } from './data.js';

const ALLOWED_WORKSHEET_TAGS = ['div', 'span', 'p', 'h3', 'h4', 'strong', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'label'];

export function sanitizeWorksheetHtml(html) {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: ALLOWED_WORKSHEET_TAGS });
}

function toRoman(num) {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romanNumerals[num - 1] || num;
}

function stripLeadingNumber(text) {
    if (!text) return text;
    return text.replace(/^\s*(I{1,3}|IV|V|VI{0,3}|IX|X)\.\s*/i, '')
        .replace(/^\s*\d+[.):]\s*/, '');
}

export function renderSubjects(subjectGrid) {
    subjectGrid.innerHTML = subjects
        .map(
            (subject) => `
    <div class="subject-card" role="button" tabindex="0" data-subject-id="${subject.id}"
         style="--subject-color: ${subject.color}; --subject-gradient: ${subject.gradient};"
         aria-label="Select ${subject.name}">
      <span class="subject-card-icon">${subject.icon}</span>
      <div class="subject-card-name">${subject.name}</div>
      <div class="subject-card-desc">${subject.description}</div>
      <div class="subject-card-chapters">📚 ${subject.chapters.length} chapters</div>
    </div>
  `
        )
        .join('');
}

export function renderChapters(subject, chapterList, selectedSubjectTitleEl) {
    selectedSubjectTitleEl.textContent = `${subject.icon} ${subject.name}`;
    chapterList.innerHTML = subject.chapters
        .map(
            (chapter, index) => `
    <div class="chapter-card" role="button" tabindex="0" data-chapter-id="${chapter.id}"
         style="--subject-color: ${subject.color}; --subject-gradient: ${subject.gradient};"
         aria-label="Select chapter: ${chapter.name}">
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

export function renderTypeCards(typeCards) {
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

export function renderDifficultyCards(difficultyCards) {
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

function renderSection(section, sectionIndex) {
    const sectionNum = toRoman(sectionIndex + 1);
    const cleanTitle = stripLeadingNumber(section.title || 'Section');
    let html = `
    <div class="worksheet-section">
      <div class="worksheet-section-header">
        <span class="worksheet-section-title">${sectionNum}. ${cleanTitle}</span>
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
      <span class="q-number">${i + 1}.</span> ${stripLeadingNumber(q.question)}
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
    return questions
        .map(
            (item, i) => `
    <div class="worksheet-question">
      <span class="q-number">${i + 1}.</span> ${stripLeadingNumber(item.question || '')}
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
      <span><span class="q-number">${i + 1}.</span> ${stripLeadingNumber(q.question)}</span>
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
      <span class="q-number">${i + 1}.</span> ${stripLeadingNumber(q.question)}
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
      <span class="q-number">${i + 1}.</span> ${stripLeadingNumber(q.question)}
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

export function renderWorksheet(data, worksheetContainer) {
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
    if (data.sections && Array.isArray(data.sections)) {
        data.sections.forEach((section, sIndex) => {
            html += renderSection(section, sIndex);
        });
    }
    if (data.bonusActivity) {
        html += `
      <div class="worksheet-bonus">
        <h4>⭐ Bonus Activity</h4>
        <p>${data.bonusActivity}</p>
      </div>
    `;
    }
    if (state.includeAnswers && data.sections) {
        html += renderAnswerKey(data.sections);
    }
    worksheetContainer.innerHTML = sanitizeWorksheetHtml(html);
}
