const urlParams = new URLSearchParams(window.location.search);

const code = urlParams.get('code');
document.getElementById("input").textContent = code;

function copyLink() {
    const link = `localhost:1887/gamemenu/join-game?code=${code}`
    navigator.clipboard.writeText(link)
    document.getElementById("feedbackField").textContent = "Link copied to clipboard";
}

function copyCode() {
    navigator.clipboard.writeText(code)
    document.getElementById("feedbackField").textContent = "Code copied to clipboard";
}