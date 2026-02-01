document.addEventListener("DOMContentLoaded", () => {
    const changePageButton = document.getElementById("changePageButton");
    
    changePageButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
});