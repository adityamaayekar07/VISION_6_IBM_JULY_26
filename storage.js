
/* =========================
   STORAGE.JS
========================= */

const STORAGE_KEYS = {
    CHAT: "ai_chat_history",
    STATS: "ai_stats",
    PROFILE: "ai_profile"
};

function saveChatHistory(messages){

    localStorage.setItem(
        STORAGE_KEYS.CHAT,
        JSON.stringify(messages)
    );

}

function getChatHistory(){

    const data =
    localStorage.getItem(
        STORAGE_KEYS.CHAT
    );

    return data
        ? JSON.parse(data)
        : [];

}

function saveStats(stats){

    localStorage.setItem(
        STORAGE_KEYS.STATS,
        JSON.stringify(stats)
    );

}

function getStats(){

    const data =
    localStorage.getItem(
        STORAGE_KEYS.STATS
    );

    return data
        ? JSON.parse(data)
        : {
            questions:0,
            quizzes:0,
            mcqs:0,
            summaries:0
        };

}

function saveProfile(profile){

    localStorage.setItem(
        STORAGE_KEYS.PROFILE,
        JSON.stringify(profile)
    );

}

function getProfile(){

    const data =
    localStorage.getItem(
        STORAGE_KEYS.PROFILE
    );

    return data
        ? JSON.parse(data)
        : null;

}

console.log("Storage.js Loaded");