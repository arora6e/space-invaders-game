const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// PLAYER
const player = {
    x: 270,
    y: 550,
    width: 60,
    height: 20,
    speed: 6
};

// INPUT
let left = false;
let right = false;
let shoot = false;

// GAME STATE
let gameOver = false;
let score = 0;

// ARRAYS
let lasers = [];
let enemies = [];

// EVENTS
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") left = true;
    if (e.key === "ArrowRight") right = true;
    if (e.code === "Space") shoot = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") left = false;
    if (e.key === "ArrowRight") right = false;
    if (e.code === "Space") shoot = false;
});

// SHOOTING
function createLaser() {
    lasers.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 7
    });
}

// ENEMY SPAWN
function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: 0,
        width: 40,
        height: 20,
        speed: 2
    });
}

// COLLISION DETECTION
function collision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// UPDATE LOGIC
function update() {

    // PLAYER MOVEMENT
    if (left) player.x -= player.speed;
    if (right) player.x += player.speed;

    // BOUNDS
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // SHOOT (limit number of lasers)
    if (shoot && lasers.length < 5) {
        createLaser();
    }

    // UPDATE LASERS
    lasers.forEach((laser, lIndex) => {
        laser.y -= laser.speed;

        if (laser.y < 0) {
            lasers.splice(lIndex, 1);
        }
    });

    // UPDATE ENEMIES
    enemies.forEach((enemy, eIndex) => {
        enemy.y += enemy.speed;

        // PLAYER COLLISION → GAME OVER
        if (collision(enemy, player)) {
            gameOver = true;
        }

        // LASER COLLISION
        lasers.forEach((laser, lIndex) => {
            if (collision(laser, enemy)) {
                enemies.splice(eIndex, 1);
                lasers.splice(lIndex, 1);
                score += 10;
            }
        });

        // REMOVE OFF SCREEN
        if (enemy.y > canvas.height) {
            enemies.splice(eIndex, 1);
        }
    });
}

// DRAW EVERYTHING
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // PLAYER
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // LASERS
    ctx.fillStyle = "red";
    lasers.forEach(laser => {
        ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    });

    // ENEMIES
    ctx.fillStyle = "green";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // SCORE
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
}

// GAME LOOP
function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", 170, 280);

        ctx.font = "20px Arial";
        ctx.fillText("Final Score: " + score, 220, 330);
    }
}

// SPAWN ENEMIES EVERY 1 SECOND
setInterval(spawnEnemy, 1000);

// START GAME
gameLoop();