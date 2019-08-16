const game = {
    winner: "bad",
}

fetch("http://localhost:3001/create-new-game", {
    method: "POST",
    headers: {
    },
    body: JSON.stringify(game)
}).then(function() {
    return;
});
