
/* =========================
   DOWNLOAD.JS
========================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeDownload
);

function initializeDownload(){

    const downloadBtn =
    document.getElementById(
        "downloadBtn"
    );

    if(!downloadBtn) return;

    downloadBtn.addEventListener(
        "click",
        downloadChat
    );

}

function downloadChat(){

    const messages =
    document.querySelectorAll(
        ".message"
    );

    let content = "";

    messages.forEach(msg => {

        content +=
        msg.innerText +
        "\n\n";

    });

    const blob =
    new Blob(
        [content],
        {
            type:"text/plain"
        }
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    "AI_Chat_History.txt";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showDownloadToast(
        "Chat Downloaded"
    );

}

function showDownloadToast(message){

    const toast =
    document.querySelector(
        ".toast"
    );

    if(!toast) return;

    toast.textContent =
    message;

    toast.style.display =
    "block";

    setTimeout(() => {

        toast.style.display =
        "none";

    },2000);

}

console.log("Download.js Loaded");
