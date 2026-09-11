window.showHearDashVictory = function () {
    if (document.getElementById("heardashVictoryOverlay")) {
        document.getElementById("heardashVictoryOverlay").style.display = "flex";
        return;
    }

    const overlay = document.createElement("div");
    overlay.id = "heardashVictoryOverlay";

    overlay.innerHTML = `
        <div class="heardashVictoryBox">
            <h1>🏆 Victory!</h1>
            <p>Congratulations! You completed this game.</p>

            <button id="hdPlayAgain">Play Again</button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("hdPlayAgain").onclick = function () {
        overlay.style.display = "none";

        if (window.Y) {
            Y.fire("newGameRun");
        }
    };
};
