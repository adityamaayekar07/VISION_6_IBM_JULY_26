
/* ===================================
   CHAT.JS
=================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeChat();

    }
);

/* ===================================
   INITIALIZE CHAT
=================================== */

function initializeChat(){

    initializeSendButton();
    initializeEnterKey();
    initializeCopyButton();
    initializeClearButton();

}

/* ===================================
   ELEMENTS
=================================== */

const chatWindow =
document.getElementById(
    "chatWindow"
);

const promptInput =
document.getElementById(
    "promptInput"
);

/* ===================================
   SEND BUTTON
=================================== */

function initializeSendButton(){

    const askBtn =
    document.getElementById(
        "askBtn"
    );

    if(!askBtn) return;

    askBtn.addEventListener(
        "click",
        sendMessage
    );

}

/* ===================================
   ENTER KEY SEND
=================================== */

function initializeEnterKey(){

    if(!promptInput) return;

    promptInput.addEventListener(
        "keydown",
        (e) => {

            if(
                e.key === "Enter" &&
                !e.shiftKey
            ){

                e.preventDefault();

                sendMessage();

            }

        }
    );

}

/* ===================================
   SEND MESSAGE
=================================== */

function sendMessage(){

    const text =
    promptInput.value.trim();

    if(text === "") return;

    addUserMessage(text);

    promptInput.value = "";

    updateCounter();

    showTypingIndicator();

    setTimeout(() => {

        removeTypingIndicator();

        generateAIResponse(text);

    },1500);

}

/* ===================================
   USER MESSAGE
=================================== */

function addUserMessage(text){

    const wrapper =
    document.createElement("div");

    wrapper.className =
    "message-row user-row";

    wrapper.innerHTML = `

        <div class="message user-message">
            ${text}
            <div class="timestamp">
                ${getCurrentTime()}
            </div>
        </div>

    `;

    chatWindow.appendChild(wrapper);

    scrollToBottom();

}

/* ===================================
   AI MESSAGE
=================================== */

function addAIMessage(text){

    const wrapper =
    document.createElement("div");

    wrapper.className =
    "message-row ai-row";

    wrapper.innerHTML = `

        <div class="message ai-message">

            <span class="stream-content"></span>

            <span class="streaming-cursor"></span>

            <div class="timestamp">
                ${getCurrentTime()}
            </div>

        </div>

    `;

    chatWindow.appendChild(wrapper);

    scrollToBottom();

    streamText(
        wrapper.querySelector(
            ".stream-content"
        ),
        text
    );

}

/* ===================================
   STREAMING EFFECT
=================================== */

function streamText(
    element,
    text
){

    let index = 0;

    const interval =
    setInterval(() => {

        element.textContent +=
        text.charAt(index);

        index++;

        scrollToBottom();

        if(index >= text.length){

            clearInterval(interval);

            const cursor =
            element.parentElement
            .querySelector(
                ".streaming-cursor"
            );

            if(cursor){

                cursor.remove();

            }

        }

    },15);

}

/* ===================================
   AI RESPONSE
=================================== */

function generateAIResponse(
    question
){

    let response = "";

    const lower =
    question.toLowerCase();

    if(
        lower.includes("java")
    ){

        response =
        "Java is a high-level, object-oriented programming language widely used for enterprise, web, desktop, and Android applications.";

    }
    else if(
        lower.includes("python")
    ){

        response =
        "Python is a simple, powerful, and versatile programming language used in web development, data science, AI, and automation.";

    }
    else if(
        lower.includes("dbms")
    ){

        response =
        "DBMS stands for Database Management System. It is software used to store, manage, retrieve, and organize data efficiently.";

    }
    else if(
        lower.includes("quiz")
    ){

        response =
        "Quiz Generated:\n\n1. What is OOP?\n2. What is Inheritance?\n3. What is Polymorphism?\n4. What is Encapsulation?";

    }
    else if(
        lower.includes("mcq")
    ){

        response =
        "MCQ:\n\nWhich keyword is used for inheritance in Java?\nA) extends\nB) inherit\nC) super\nD) implement\n\nAnswer: A";

    }
    else{

        response =
        "AI Response: Thank you for your question. The backend AI model will provide a real response here once connected to OpenAI or another LLM.";

    }

    addAIMessage(response);

}

/* ===================================
   TYPING INDICATOR
=================================== */

function showTypingIndicator(){

    const wrapper =
    document.createElement("div");

    wrapper.className =
    "message-row ai-row";

    wrapper.id =
    "typingIndicator";

    wrapper.innerHTML = `

        <div class="message ai-message">

            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>

    `;

    chatWindow.appendChild(wrapper);

    scrollToBottom();

}

/* ===================================
   REMOVE TYPING
=================================== */

function removeTypingIndicator(){

    const typing =
    document.getElementById(
        "typingIndicator"
    );

    if(typing){

        typing.remove();

    }

}

/* ===================================
   COPY CHAT
=================================== */

function initializeCopyButton(){

    const copyBtn =
    document.getElementById(
        "copyBtn"
    );

    if(!copyBtn) return;

    copyBtn.addEventListener(
        "click",
        copyChat
    );

}

function copyChat(){

    const messages =
    document.querySelectorAll(
        ".message"
    );

    let text = "";

    messages.forEach(msg => {

        text +=
        msg.innerText + "\n\n";

    });

    navigator.clipboard
    .writeText(text)
    .then(() => {

        showChatToast(
            "Chat Copied"
        );

    });

}

/* ===================================
   CLEAR CHAT
=================================== */

function initializeClearButton(){

    const clearBtn =
    document.getElementById(
        "clearBtn"
    );

    if(!clearBtn) return;

    clearBtn.addEventListener(
        "click",
        clearChat
    );

}

function clearChat(){

    chatWindow.innerHTML = `

        <div class="empty-chat">

            <i class="fas fa-robot"></i>

            <h3>
                Chat Cleared
            </h3>

            <p>
                Start a new conversation
            </p>

        </div>

    `;

    showChatToast(
        "Chat Cleared"
    );

}

/* ===================================
   AUTO SCROLL
=================================== */

function scrollToBottom(){

    if(!chatWindow) return;

    chatWindow.scrollTop =
    chatWindow.scrollHeight;

}

/* ===================================
   CURRENT TIME
=================================== */

function getCurrentTime(){

    const now =
    new Date();

    return now.toLocaleTimeString(
        [],
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}

/* ===================================
   COUNTER UPDATE
=================================== */

function updateCounter(){

    const wordCount =
    document.getElementById(
        "wordCount"
    );

    const charCount =
    document.getElementById(
        "charCount"
    );

    if(!wordCount ||
       !charCount) return;

    wordCount.textContent =
    "Words: 0";

    charCount.textContent =
    "0 / 2000";

}

/* ===================================
   CHAT TOAST
=================================== */

function showChatToast(message){

    const toast =
    document.querySelector(
        ".toast"
    );

    if(!toast) return;

    toast.textContent =
    message;

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
   CHAT STORAGE HOOK
=================================== */

function saveMessage(
    role,
    text
){

    console.log(
        role,
        text
    );

}

/* ===================================
   DEBUG
=================================== */

console.log(
    "Chat.js Loaded Successfully"
);