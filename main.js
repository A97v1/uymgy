// Encapsulated logic (Clean Architecture Style)
document.addEventListener("DOMContentLoaded", () => {

    const connectBtn = document.getElementById("connectBtn");

    connectBtn.addEventListener("click", handleConnectionClick);

    function handleConnectionClick() {
        openContactModal();
    }

    function openContactModal() {
        alert("Redirecting to connection form...");
        // In production:
        // window.location.href = "/contact.html";
    }

});
