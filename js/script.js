let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const blockWidth = 36;
const blockHeight = 10;
const gap = 1;

let blocks = [];

let colors = {
    R: "red",
    O: "orange",
    Y: "yellow",
    G: "green"
};

let platform = {
    x: width / 2,
    y: height - blockHeight * 10,
    width: blockWidth,
    height: blockHeight,
    speed: 4
};

let ball = {
    x: width/2,
    y: height/2,
    width: 4,
    height: 4,
    speedX: 0,
    speedY: 0
}

let gamePoints = 0;
let lives = 3;

let time = null;

let map = [
    [],
    [],
    [],
    [],
    [],
    [],
    ["R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R"],
    ["R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R"],
    ["O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O"],
    ["O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O"],
    ["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"],
    ["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"]
];

for(let col=0;col<map.length;col++)
{
    for(let row=0;row<map[col].length;row++)
    {
        const color = map[col][row];
        
        blocks.push({
            x: (gap + blockWidth) * row + blockWidth/2 + 3,
            y: (gap + blockHeight) * col,
            color: colors[color]
        });
    }
}

let maxGamePoints = blocks.length;

function drawLives()
{
    ctx.fillStyle = "green";
    ctx.font = "26px Arial";
    ctx.fillText("количество жизней: " + lives, 720, 35);
}

function checkGameOver()
{
    drawLives();

    if(lives == 0)
    {
        clearInterval(time);
        alert("Вы проиграла");
        document.location.reload();
    }
}

function checkWin()
{
    ctx.fillStyle = "green";
    ctx.font = "26px Arial";
    ctx.fillText("количество сбитых блоков: " + gamePoints, 20, 35);

    if(gamePoints == maxGamePoints)
    {
        clearInterval(time);
        alert("Вы победил!!!))))))");
        document.location.reload();
    }
}

function colision(x1, y1, width1, height1, x2, y2, width2, height2)
{
    return x1 < x2 + width2&&
        x1 + width1 > x2&&
        y1 < y2 + height2&&
        y1 + height1 > y2
}

function checkColision()
{
    for(let i=0;i<blocks.length;i++)
    {
        if(colision(ball.x, ball.y, ball.width, ball.height, blocks[i].x, blocks[i].y, blockWidth, blockHeight))
        {
            gamePoints++;

            if(ball.y < blocks[i].y + blockHeight&&
                ball.y + ball.height > blocks[i].y)
                {
                    if(ball.speedY == 2)
                        ball.speedY--;
                    else if(ball.speedY == 1)
                        ball.speedY++;
                    ball.speedY *= -1;
                }
                else 
                {
                    if(ball.speedX == 2)
                        ball.speedX--;
                    else if(ball.speedX == 1)
                        ball.speedX++;
                    ball.speedX *= -1;
                }

            blocks.splice(i, 1);
            break;
        }
    }

    if(platform.x < 10)
        platform.x = 10;
    else if(platform.x + platform.width > width - 10)
        platform.x = width - 10 - platform.width;
    
    if(colision(platform.x, platform.y, platform.width, platform.height, ball.x, ball.y, ball.width, ball.height))
    {
        ball.y = platform.y - ball.width;

        if(ball.speedY == 2)
            ball.speedY--;
        else if(ball.speedY == 1)
            ball.speedY++;
        
        ball.speedY *= -1;
    } else if(ball.x < 10)
    {
        ball.x = 10;

        if(ball.speedX == 2)
            ball.speedX--;
        else if(ball.speedX == 1)
            ball.speedX++;

        ball.speedX *= -1;
    } else if(ball.x + ball.width > width - 10)
    {
        ball.x = width - 10 - ball.width;

        if(ball.speedX == 2)
            ball.speedX--;
        else if(ball.speedX == 1)
            ball.speedX++;

        ball.speedX *= -1;
    }
    if(ball.y < 10)
    {
        ball.y = 10;

        if(ball.speedY == 2)
            ball.speedY--;
        else if(ball.speedY == 1)
            ball.speedY++;

        ball.speedY *= -1;
    }
    if(ball.y + ball.height > height - 10)
    {
        lives--;
        checkGameOver();

        ball.x = width/2;
        ball.y = height/2;
        ball.width = 4;
        ball.height = 4;
        ball.speedX = 0;
        ball.speedY = 0;

        platform.x = width / 2;
        platform.y = height - blockHeight * 10;
        platform.width = blockWidth;
        platform.height = blockHeight;
        platform.speed = 4;
    }
}

function logic()
{
    ball.x += ball.speedX;
    ball.y += ball.speedY;
}

function draw()
{
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "white";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    blocks.forEach(function (block) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, blockWidth, blockHeight);
    });

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, 10);
    ctx.fillRect(0, 0, 10, height);
    ctx.fillRect(width - 10, 0, 10, height);

    drawLives();
}

function main()
{
    checkColision();
    logic();
    draw();
    checkWin();
}

document.addEventListener("keydown", function(e) {
    //console.log(e.keyCode);
    if(e.keyCode === 39)
        platform.x += platform.speed;
    else if(e.keyCode === 37)
        platform.x -= platform.speed;
    else if(e.keyCode === 32 && ball.speedX == 0 && ball.speedY == 0)
    {
        ball.speedX = 2;
        ball.speedY = 2;
    } else if(e.keyCode === 27)
        alert("Пауза");
});

document.addEventListener("mousemove", function(e) {
    platform.x = e.offsetX - platform.width / 2;
});

time = setInterval(main, 1000/60);
