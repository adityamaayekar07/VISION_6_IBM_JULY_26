
/* ===================================
   THEME.JS
   DARK / LIGHT MODE
=================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTheme();

    }
);

/* ===================================
   INITIALIZE THEME
=================================== */

function initializeTheme(){

    const themeToggle =
    document.getElementById(
        "themeToggle"
    );

    if(!themeToggle) return;

    const savedTheme =
    localStorage.getItem(
        "theme"
    );

    if(savedTheme === "dark"){

        document.body.classList.add(
            "dark"
        );

        updateThemeIcon(true);

    }
    else{

        updateThemeIcon(false);

    }

    themeToggle.addEventListener(
        "click",
        toggleTheme
    );

}

/* ===================================
   TOGGLE THEME
=================================== */

function toggleTheme(){

    const isDark =
    document.body.classList.toggle(
        "dark"
    );

    if(isDark){

        localStorage.setItem(
            "theme",
            "dark"
        );

        updateThemeIcon(true);

        showThemeToast(
            "Dark Mode Enabled"
        );

    }
    else{

        localStorage.setItem(
            "theme",
            "light"
        );

        updateThemeIcon(false);

        showThemeToast(
            "Light Mode Enabled"
        );

    }

}

/* ===================================
   UPDATE ICON
=================================== */

function updateThemeIcon(isDark){

    const themeToggle =
    document.getElementById(
        "themeToggle"
    );

    if(!themeToggle) return;

    if(isDark){

        themeToggle.innerHTML =
        '<i class="fas fa-sun"></i>';

    }
    else{

        themeToggle.innerHTML =
        '<i class="fas fa-moon"></i>';

    }

}

/* ===================================
   THEME TOAST
=================================== */

function showThemeToast(message){

    const toast =
    document.querySelector(
        ".toast"
    );

    if(!toast) return;

    toast.textContent = message;

    toast.style.display =
    "block";

    toast.style.opacity =
    "1";

    setTimeout(() => {

        toast.style.opacity =
        "0";

        setTimeout(() => {

            toast.style.display =
            "none";

        },300);

    },2000);

}

/* ===================================
   SYSTEM THEME DETECTION
=================================== */

function detectSystemTheme(){

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

}

/* ===================================
   APPLY SYSTEM THEME
=================================== */

function applySystemTheme(){

    const savedTheme =
    localStorage.getItem(
        "theme"
    );

    if(savedTheme) return;

    if(detectSystemTheme()){

        document.body.classList.add(
            "dark"
        );

        updateThemeIcon(true);

    }

}

/* ===================================
   AUTO APPLY
=================================== */

applySystemTheme();

/* ===================================
   RESET THEME
=================================== */

function resetTheme(){

    localStorage.removeItem(
        "theme"
    );

    document.body.classList.remove(
        "dark"
    );

    updateThemeIcon(false);

}

/* ===================================
   EXPORT FUNCTIONS
=================================== */

window.toggleTheme =
toggleTheme;

window.resetTheme =
resetTheme;

/* ===================================
   OPTIONAL SHORTCUT
   CTRL + D
=================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if(
            event.ctrlKey &&
            event.key.toLowerCase() === "d"
        ){

            event.preventDefault();

            toggleTheme();

        }

    }
);

/* ===================================
   THEME TRANSITION
=================================== */

document.documentElement.style
.setProperty(
    "scroll-behavior",
    "smooth"
);

document.body.style.transition =
"background 0.3s ease, color 0.3s ease";

/* ===================================
   DEBUG
=================================== */

console.log(
    "Theme.js Loaded Successfully"
);