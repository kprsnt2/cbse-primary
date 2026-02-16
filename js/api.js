// API and worksheet generation - CBSE Worksheet Generator

import { state } from './state.js';
import { buildPrompt } from './prompts.js';
import { renderWorksheet, sanitizeWorksheetHtml } from './render.js';

export function createGenerateWorksheet(deps) {
    const {
        showLoading,
        showError,
        showStep,
        worksheetContainer,
        stepWorksheet,
    } = deps;

    return async function generateWorksheet() {
        if (!state.selectedSubject || !state.selectedChapter) {
            showError('Missing selection', 'Please select a subject and a chapter first.');
            return;
        }
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
                renderWorksheet(data.worksheet, worksheetContainer);
                showStep(stepWorksheet);
            } else if (data.raw) {
                state.worksheetData = { title: state.selectedChapter.name, raw: data.raw };
                worksheetContainer.innerHTML = sanitizeWorksheetHtml(`
        <div class="worksheet-school-header">
          <div class="worksheet-school-name">📚 CBSE Grade 1 — Cambridge Shades</div>
        </div>
        <div class="worksheet-title">${state.selectedChapter.name}</div>
        <div style="white-space: pre-wrap; font-size: 0.9rem; line-height: 1.8;">${data.raw}</div>
      `);
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
    };
}
