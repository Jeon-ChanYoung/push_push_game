const LEVEL = [
    "########",
    "#...G..#",
    "#..B..B#",
    "#..P...#",
    "#####.G#",
    "########"
];

let player = {x:0, y:0};

function parseMap() {
    balls = [];
    goals = [];
    LEVEL.forEach((row, y) => {
        [...row].forEach((cell, x) => {
            if (cell === "P") player = {x, y};
            if (cell === "B") balls.push({x, y});
            if (cell === "G") goals.push({x, y});
        });
    });
}

function render() {
    const game = document.getElementById("game");
    game.innerHTML = "";

    for (let y=0; y<LEVEL.length; y++) {
        for (let x=0; x<LEVEL[y].length; x++) {
            const div = document.createElement("div");
            div.classList.add("cell");

            if (isWall(x, y)) div.classList.add("wall");
            else if (isGoal(x, y)) div.classList.add("goal");
            else div.classList.add("floor");

            if (player.x === x && player.y === y) {
                div.classList.add("player");
            } 
            else if (isBalls(x, y)) {
                div.classList.add("box");
            }
            game.appendChild(div);
        }
    }
}

function move(dx, dy) {
    const nx = player.x + dx;
    const ny = player.y + dy;

    if (isWall(nx, ny)) return;

    if (isBalls(nx, ny)) {
        const bx = nx + dx;
        const by = ny + dy;

        if (!isWall(bx, by) && !isBalls(bx, by)) {
            balls = balls.map(b => (b.x === nx && b.y === ny)? {x:bx, y:by}: b);
            player = {x:nx, y:ny};
        }
    }
    else {
        player = {x:nx, y:ny};
    }

    render();
}

function isWall(x, y) {
    return LEVEL[y][x] === "#";
}

function isGoal(x, y) {
    return goals.some(g => g.x === x && g.y === y)
}

function isBalls(x, y) {
    return balls.some(b => b.x === x && b.y === y)
}

function isClear() {
    return goals.every(g => isBalls(g.x, g.y));
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") move(0, -1);
    if (e.key==="ArrowDown") move(0,1);
    if (e.key==="ArrowLeft") move(-1,0);
    if (e.key==="ArrowRight") move(1,0);
});

parseMap();
render();