// Main Application Controller - CBSE Worksheet Generator

import { state } from './state.js';
import { subjects } from './data.js';
import { renderSubjects, renderChapters, renderTypeCards, renderDifficultyCards } from './render.js';
import { createGenerateWorksheet } from './api.js';
import { attachEventListeners } from './events.js';
import { printWorksheet } from './pdf.js';
import { loadLastChoice } from './storage.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const stepSubjects = $('#stepSubjects');
const stepChapters = $('#stepChapters');
const stepOptions = $('#stepOptions');
const stepWorksheet = $('#stepWorksheet');
const subjectGrid = $('#subjectGrid');
const chapterList = $('#chapterList');
const typeCards = $('#typeCards');
const difficultyCards = $('#difficultyCards');
const generateBtn = $('#generateBtn');
const regenerateBtn = $('#regenerateBtn');
const includeAnswersToggle = $('#includeAnswers');
const worksheetContainer = $('#worksheetContainer');
const loadingOverlay = $('#loadingOverlay');
const loadingTip = $('#loadingTip');
const errorModal = $('#errorModal');
const backToSubjects = $('#backToSubjects');
const backToChapters = $('#backToChapters');
const backToOptions = $('#backToOptions');
const themeToggle = $('#themeToggle');

const loadingTips = [
    'AI is crafting perfect questions for your exam prep! ✨',
    'Making sure every question matches your school pattern... 📋',
    'Adding fun and learning together! 🎮',
    'Almost there... preparing a printable worksheet! 🖨️',
    'Checking difficulty level and question variety... 📊',
    'Creating age-appropriate content for Grade 1... 🧒',
    'This usually takes 10-15 seconds... ⏳',
];

let loadingTipIntervalId = null;

function setGenerateButtonsDisabled(disabled) {
    if (generateBtn) generateBtn.disabled = disabled;
    if (regenerateBtn) regenerateBtn.disabled = disabled;
}

function showLoading(show) {
    if (show) {
        if (loadingTipIntervalId) clearInterval(loadingTipIntervalId);
        loadingTipIntervalId = null;
        loadingTip.textContent = loadingTips[Math.floor(Math.random() * loadingTips.length)];
        loadingOverlay.classList.add('active');
        setGenerateButtonsDisabled(true);
        loadingTipIntervalId = setInterval(() => {
            if (!loadingOverlay.classList.contains('active')) {
                clearInterval(loadingTipIntervalId);
                loadingTipIntervalId = null;
                return;
            }
            loadingTip.textContent = loadingTips[Math.floor(Math.random() * loadingTips.length)];
        }, 3000);
    } else {
        if (loadingTipIntervalId) {
            clearInterval(loadingTipIntervalId);
            loadingTipIntervalId = null;
        }
        loadingOverlay.classList.remove('active');
        setGenerateButtonsDisabled(false);
    }
}

function showError(title, message) {
    $('#errorTitle').textContent = title;
    $('#errorMessage').textContent = message;
    errorModal.classList.add('active');
    $('#errorClose')?.focus();
}

function closeErrorModal() {
    errorModal.classList.remove('active');
}

function showStep(stepEl) {
    $$('.step').forEach((s) => s.classList.remove('step-active'));
    stepEl.classList.add('step-active');
    const stepNum = stepEl.getAttribute('data-step') || '1';
    const indicator = stepEl.querySelector('.step-indicator');
    if (indicator) indicator.textContent = `Step ${stepNum} of 4`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-visible'));
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

const generateWorksheet = createGenerateWorksheet({
    showLoading,
    showError,
    showStep,
    worksheetContainer,
    stepWorksheet,
});

function init() {
    renderSubjects(subjectGrid);
    renderTypeCards(typeCards);
    renderDifficultyCards(difficultyCards);
    loadTheme();
    const last = loadLastChoice();
    if (last) {
        const subject = subjects.find((s) => s.id === last.subjectId);
        const chapter = subject?.chapters.find((c) => c.id === last.chapterId);
        if (subject && chapter) {
            state.selectedSubject = subject;
            state.selectedChapter = chapter;
            renderChapters(subject, chapterList, $('#selectedSubjectTitle'));
            $('#selectedChapterTitle').textContent = `${subject.icon} ${subject.name} → ${chapter.name}`;
            showStep(stepOptions);
        }
    }
    attachEventListeners({
        $,
        subjectGrid,
        chapterList,
        typeCards,
        difficultyCards,
        generateBtn,
        regenerateBtn,
        includeAnswersToggle,
        worksheetContainer,
        printBtn: $('#printBtn'),
        downloadBtn: $('#downloadBtn'),
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
        showToast,
        toggleTheme,
        stepSubjects,
        stepChapters,
        stepOptions,
        errorRetryBtn: $('#errorRetryBtn'),
    });
}

document.addEventListener('DOMContentLoaded', init);
