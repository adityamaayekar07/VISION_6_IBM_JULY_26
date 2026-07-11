
/* =========================
   UPLOAD.JS
========================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeUpload
);

function initializeUpload(){

    const fileInput =
    document.getElementById(
        "fileUpload"
    );

    if(!fileInput) return;

    fileInput.addEventListener(
        "change",
        handleFileUpload
    );

}

function handleFileUpload(event){

    const file =
    event.target.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload = function(e){

        const content =
        e.target.result;

        const textarea =
        document.getElementById(
            "promptInput"
        );

        if(textarea){

            textarea.value =
            content;

            textarea.dispatchEvent(
                new Event("input")
            );

        }

        showUploadToast(
            "File Uploaded Successfully"
        );

    };

    reader.readAsText(file);

}

function showUploadToast(message){

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

console.log("Upload.js Loaded");