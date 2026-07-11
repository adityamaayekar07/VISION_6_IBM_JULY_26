
/* =========================
   DASHBOARD.JS
========================= */

document.addEventListener(
    "DOMContentLoaded",
    loadDashboardStats
);

function loadDashboardStats(){

    const stats = getStats();

    const boxes =
    document.querySelectorAll(
        ".stat-box span"
    );

    if(boxes.length >= 4){

        boxes[0].textContent =
        stats.questions;

        boxes[1].textContent =
        stats.mcqs;

        boxes[2].textContent =
        stats.quizzes;

        boxes[3].textContent =
        stats.summaries;

    }

}

function increaseQuestionCount(){

    const stats = getStats();

    stats.questions++;

    saveStats(stats);

    loadDashboardStats();

}

function increaseMCQCount(){

    const stats = getStats();

    stats.mcqs++;

    saveStats(stats);

    loadDashboardStats();

}

function increaseQuizCount(){

    const stats = getStats();

    stats.quizzes++;

    saveStats(stats);

    loadDashboardStats();

}

function increaseSummaryCount(){

    const stats = getStats();

    stats.summaries++;

    saveStats(stats);

    loadDashboardStats();

}

console.log("Dashboard.js Loaded");
