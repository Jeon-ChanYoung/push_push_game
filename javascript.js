let LEVEL = [
    "81111112",
    "7ZZZZZZ3",
    "7XXXXXX3",
    "7...G..3",
    "7..B..B3",
    "7..P...3",
    "7.....G3",
    "65555554"
];

const tileMap = {
    "1": "topWall.png",
    "2": "topRightCorner.png",
    "3": "rightWall.png",
    "4": "bottomRightCorner.png",
    "5": "bottomWall.png",
    "6": "bottomLeftCorner.png",
    "7": "leftWall.png",
    "8": "topLeftCorner.png",
    "Z": "wallPaper1.png",
    "X": "wallPaper2.png",
    ".": "floor.png",
    "#": "wall.png",
    "P": "cat.png",
    "B": "ball.png",
    "G": "flag.png"
}



let player = {x:0, y:0};
let balls = [];
let goals = [];

function parseMap() {
    balls = [];
    goals = [];
    LEVEL = LEVEL.map((row, y) => {
        return [...row].map((cell, x) => {
            if (cell === "P") {
                player = {x, y};
                return "."; // 플레이어는 좌표만 저장하고 맵에서는 제거
            }
            if (cell === "B") {
                balls.push({x, y});
                return "."; // 박스도 제거
            }
            if (cell === "G") {
                goals.push({x, y});
                return "."; // 목표 지점도 제거
            }
            return cell; // 나머지는 그대로 유지
        }).join("");
    });
}

function render() {
    const game = document.getElementById("game");
    game.innerHTML = "";

    const rows = LEVEL.length;
    const cols = LEVEL[0].length;
    game.style.display = "grid";
    game.style.gridTemplateColumns = `repeat(${cols}, 65px)`;
    game.style.gridTemplateRows = `repeat(${rows}, 65px)`;

    for (let y=0; y<LEVEL.length; y++) {
        for (let x=0; x<LEVEL[y].length; x++) {
            const cell = LEVEL[y][x];
            const div = document.createElement("div");
            div.classList.add("cell");

            if (tileMap[cell]) {
                div.style.backgroundImage = `url('tileset/${tileMap[cell]}')`;
                div.style.backgroundSize = "cover";
            } 
                    
            if (isBalls(x, y)) {
                div.style.backgroundImage = `url('tileset/${tileMap["B"]}')`;
            }
            if (isGoal(x, y)) {
                if (isBalls(x, y)) {
                    div.style.backgroundImage = `url('tileset/flag_on_ball.png')`;
                } else {
                    div.style.backgroundImage = `url('tileset/${tileMap["G"]}')`;
                }
            }
            if (player.x === x && player.y === y) {
                div.style.backgroundImage = `url('tileset/${tileMap["P"]}')`;
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
            balls = balls.map(b => (b.x === nx && b.y === ny) ? {x:bx, y:by}: b);
            player = {x:nx, y:ny};
        }
    }
    else {
        player = {x:nx, y:ny};
    }

    render();
}

function isWall(x, y) {
    const wallChars = ["1","2","3","4","5","6","7","8","Z","X"];
    return wallChars.includes(LEVEL[y][x]);
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