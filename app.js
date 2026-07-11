/* ===================================
   APP INITIALIZATION
=================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeWordCounter();
    initializeQuickPrompts();
    initializeActionButtons();
    initializeToast();

});

/* ===================================
   WORD + CHARACTER COUNTER
=================================== */

function initializeWordCounter(){

    const textarea = document.getElementById("promptInput");
    const wordCount = document.getElementById("wordCount");
    const charCount = document.getElementById("charCount");

    if(!textarea) return;

    textarea.addEventListener("input", () => {

        const text = textarea.value.trim();

        const words =
            text.length === 0
            ? 0
            : text.split(/\s+/).length;

        const chars = textarea.value.length;

        if(wordCount){
            wordCount.textContent =
            `Words: ${words}`;
        }

        if(charCount){
            charCount.textContent =
            `${chars} / 2000`;
        }

    });

}

/* ===================================
   QUICK PROMPTS
=================================== */

function initializeQuickPrompts(){

    const textarea =
    document.getElementById("promptInput");

    const buttons =
    document.querySelectorAll(
        ".quick-prompts button"
    );

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            textarea.value =
            button.innerText;

            textarea.dispatchEvent(
                new Event("input")
            );

        });

    });

}

/* ===================================
   ACTION BUTTONS
=================================== */

function initializeActionButtons(){

    const askBtn =
    document.getElementById("askBtn");

    const summaryBtn =
    document.getElementById("summaryBtn");

    const mcqBtn =
    document.getElementById("mcqBtn");

    const quizBtn =
    document.getElementById("quizBtn");

    if(askBtn){

        askBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "AI Question Submitted"
                );

            }
        );

    }

    if(summaryBtn){

        summaryBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "Generating Summary..."
                );

            }
        );

    }

    if(mcqBtn){

        mcqBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "Generating MCQs..."
                );

            }
        );

    }

    if(quizBtn){

        quizBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "Creating Quiz..."
                );

            }
        );

    }

}

/* ===================================
   TOAST NOTIFICATION
=================================== */

function initializeToast(){

    const toast =
    document.querySelector(".toast");

    if(toast){

        toast.style.display = "none";

    }

}

function showToast(message){

    const toast =
    document.querySelector(".toast");

    if(!toast) return;

    toast.textContent = message;

    toast.style.display = "block";

    toast.style.opacity = "1";

    setTimeout(() => {

        toast.style.opacity = "0";

        setTimeout(() => {

            toast.style.display = "none";

        },300);

    },2500);

}

/* ===================================
   LOADER CONTROL
=================================== */

function showLoader(){

    const loader =
    document.querySelector(
        ".loader-section"
    );

    if(loader){

        loader.style.display =
        "block";

    }

}

function hideLoader(){

    const loader =
    document.querySelector(
        ".loader-section"
    );

    if(loader){

        loader.style.display =
        "none";

    }

}

/* ===================================
   PROGRESS BAR CONTROL
=================================== */

function updateProgress(percent){

    const progressFill =
    document.querySelector(
        ".progress-fill"
    );

    if(progressFill){

        progressFill.style.width =
        percent + "%";

    }

}

/* ===================================
   FLOATING ACTIONS
=================================== */

const floatingButtons =
document.querySelectorAll(
    ".floating-actions button"
);

floatingButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            showToast(
                `${button.innerText} Selected`
            );

        }
    );

});

/* ===================================
   PROFILE MODAL
=================================== */

const profileBtn =
document.getElementById(
    "profileBtn"
);

const profileModal =
document.querySelector(
    ".profile-modal"
);

if(profileBtn && profileModal){

    profileBtn.addEventListener(
        "click",
        () => {

            if(
                profileModal.style.display ===
                "block"
            ){

                profileModal.style.display =
                "none";

            }
            else{

                profileModal.style.display =
                "block";

            }

        }
    );

}

/* ===================================
   ESC KEY CLOSE MODAL
=================================== */

document.addEventListener(
    "keydown",
    (e) => {

        if(
            e.key === "Escape" &&
            profileModal
        ){

            profileModal.style.display =
            "none";

        }

    }
);

/* ===================================
   SAVE PROFILE
=================================== */

const saveProfileBtn =
document.querySelector(
    ".profile-modal button"
);

if(saveProfileBtn){

    saveProfileBtn.addEventListener(
        "click",
        () => {

            showToast(
                "Profile Saved"
            );

            profileModal.style.display =
            "none";

        }
    );

}

/* ===================================
   DASHBOARD CARD CLICK
=================================== */

const dashboardCards =
document.querySelectorAll(
    ".card"
);

dashboardCards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            showToast(
                card.innerText +
                " Opened"
            );

        }
    );

});

/* ===================================
   HISTORY SEARCH
=================================== */

const historySearch =
document.getElementById(
    "historySearch"
);

if(historySearch){

    historySearch.addEventListener(
        "keyup",
        () => {

            const value =
            historySearch.value
            .toLowerCase();

            const items =
            document.querySelectorAll(
                ".history-section li"
            );

            items.forEach(item => {

                item.style.display =
                item.innerText
                .toLowerCase()
                .includes(value)
                ? "block"
                : "none";

            });

        }
    );

}