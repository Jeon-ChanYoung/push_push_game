let loadedLEVEL = LEVELS[Math.floor(Math.random() * LEVELS.length)];
// let loadedLEVEL = LEVELS[6];
let LEVEL = cloneLevel(loadedLEVEL);

function cloneLevel(level) {
    return level.map(row => row.slice());
}

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
    "P": "cat.png",           // P : Player
    "B": "ball.png",          // B : Ball
    "G": "flag.png",          // G : Goal   
    "L": "tableLeft.png",     // L : Left table
    "R": "tableRight.png",    // R : Right table
    "U": "chimneyTop.png",    // U : Up chimney
    "D": "chimneyBottom.png",  // D : Down chimney
    "C": "ceramics.png",        // C : Ceramics
    "T": "television.png",      // T : Television
    "N": "N_table.png",
    "M": "M_chairLeft.png",
    "H": "H_chairRight.png"
}

const WALL_CHARS = [
    "1","2","3","4","5","6","7","8","Z","X",
    "L","R","U","D","C","T", "N","M","H"
];

let player = {x:0, y:0};
let balls = [];
let goals = [];

function parseMap() {
    LEVEL = cloneLevel(loadedLEVEL);
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
    game.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
    game.style.gridTemplateRows = `repeat(${rows}, 60px)`;

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
            if (player.x === x && player.y === y) {
                div.style.backgroundImage = `url('tileset/${tileMap["P"]}')`;
            }
            if (isGoal(x, y)) {
                if (isBalls(x, y)) {
                    div.style.backgroundImage = `url('tileset/flag_on_ball.png')`;
                } 
                else if (player.x === x && player.y === y) {
                    div.style.backgroundImage = `url('tileset/flag_on_cat.png')`;
                }
                else {
                    div.style.backgroundImage = `url('tileset/${tileMap["G"]}')`;
                }
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
    return WALL_CHARS.includes(LEVEL[y][x]);
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

// 키보드 이벤트 처리 (화살표 키 or WASD)
document.addEventListener("keydown", e => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }

    const keyEl = document.querySelector(`.key[data-key="${e.key}"]`);
    if (keyEl) keyEl.classList.add("active");

    if (e.key === "ArrowUp" || e.key === "w") move(0, -1);
    if (e.key==="ArrowDown" || e.key === "s") move(0,1);
    if (e.key==="ArrowLeft" || e.key === "a") move(-1,0);
    if (e.key==="ArrowRight"|| e.key === "d") move(1,0);

    if (e.key === "r" || e.key === "R") {
        parseMap();
        render();
    }
});

// 마우스 클릭 이벤트 처리
document.querySelectorAll(".key").forEach(el => {
    el.addEventListener("click", () => {
        const bg = el.style.backgroundImage;

        if (bg.includes("key_w") || bg.includes("key_up")) move(0, -1);
        if (bg.includes("key_s") || bg.includes("key_down")) move(0, 1);
        if (bg.includes("key_a") || bg.includes("key_left")) move(-1, 0);
        if (bg.includes("key_d") || bg.includes("key_right")) move(1, 0);
        if (bg.includes("key_r")) {
            parseMap();
            render();
        }
    });
});

// 키에서 손 뗄 때 효과 해제
document.addEventListener("keyup", e => {
    const keyEl = document.querySelector(`.key[data-key="${e.key}"]`);
    if (keyEl) keyEl.classList.remove("active");
});

function preloadImage(paths, allImagesLoadedCallback) {
    let loadedCount = 0;
    const totalCount = paths.length;
    
    paths.forEach(path => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === totalCount) {
                allImagesLoadedCallback();
            }
        }

        img.onerror = () => {
            console.error(`Failed to load image: ${path}`);
            loadedCount++;
            if (loadedCount === totalCount) {
                allImagesLoadedCallback();
            }
        }
    });
}

const allImages = Object.values(tileMap).map(filename => `tileset/${filename}`);
allImages.push("tileset/flag_on_ball.png");
allImages.push("tileset/flag_on_cat.png");

// 이미지 미리 로드
preloadImage(allImages, () => {
    console.log("All images loaded!");
    parseMap();
    render();
});