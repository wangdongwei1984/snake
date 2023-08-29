const cellsInOneRow = 20, cellSizeInPixes = 40;
var score = 0;
var touchStartPosition;
var isDarkTheme = false, backgroundColor = "white";
var timeOut;

const canvas = document.querySelector('#can');
var snake = [41, 40],       // snake队列表示蛇身，初始节点存在但不显示
    direction = 1,          // 1表示向右，-1表示向左，20表示向下，-20表示向上
    food = 43,              // 食物的位置
    n,                      // 下一个要到的位置的序号，范围[0,399]
    box = canvas.getContext('2d'); // 从0到399表示box里[0~19]*[0~19]的所有节点，每20px一个节点
drawBackground();

const gifs = [
    'https://media.giphy.com/media/vQqeT3AYg8S5O/giphy.gif',
    'https://media4.giphy.com/media/l0EwYB32fj4VZxMpa/giphy.gif',
    'https://media.giphy.com/media/XweOsBl72PFcc/giphy.gif',
    'https://media.giphy.com/media/lJ0JGfNBrRWJVCRChd/giphy.gif',
    'https://i2.wp.com/media4.giphy.com/media/5p2wQFyu8GsFO/giphy.gif',
    'https://media.giphy.com/media/jIRPOnUASNsQw/giphy.gif',
    'https://media.giphy.com/media/XR9Dp54ZC4dji/giphy.gif',
    'https://media.giphy.com/media/1Zt3z4uEBPZQY/giphy.gif',
    'https://media.giphy.com/media/tPx9tL0kRmUDe/giphy.gif',
    'https://media.giphy.com/media/liFaAWEOa1uKc/giphy.gif',
    'https://media.giphy.com/media/2gtoSIzdrSMFO/giphy.gif']; 
const scoreElement = document.querySelector('#score'), starSpanElement = document.querySelector('#starSpan'), hiddenStar = document.querySelector('[name="star"]');
const gifImg = document.querySelector('#suprise'), snakeShutMouthImg = document.querySelector("#snakeShutMouth"), snakeOpenMouthImg = document.querySelector("#snakeOpenMouth"), snakeSadImg = document.querySelector("#snakeSad");


function drawHead(seat, image) {
    const topLeftX = seat % cellsInOneRow * cellSizeInPixes + 1, topLeftY = ~~(seat / cellsInOneRow) * cellSizeInPixes + 1, cellSize = cellSizeInPixes - 2;
    const translateX = topLeftX + cellSize / 2, translateY = topLeftY + cellSize / 2;
    box.save();
    box.translate(translateX, translateY);
    var rotation = 0;
    if (direction == 20) {
        rotation = Math.PI / 2;
    } else if (direction == -20) {
        rotation = -Math.PI / 2;
    } else if (direction == - 1) {
        rotation = Math.PI;
        box.scale(1, -1);
    }

    box.rotate(rotation);
    box.drawImage(image, 0 - cellSize / 2, 0 - cellSize / 2, cellSize, cellSize);
    box.translate(-translateX, -translateY);
    box.restore();
}

function draw(seat, fillColor, radius) {
    //用color填充一个矩形，以前两个参数为x，y坐标，后两个参数为宽和高。
    box.fillStyle = fillColor;
    let borderRadius = [];
    borderRadius.push(radius);
    box.beginPath();
    box.roundRect(seat % cellsInOneRow * cellSizeInPixes + 1, ~~(seat / cellsInOneRow) * cellSizeInPixes + 1, cellSizeInPixes - 2, cellSizeInPixes - 2, borderRadius);
    box.fill();
}

document.onkeydown = function (evt) {
    //当键盘上下左右键摁下的时候改变direction
    direction = snake[1] - snake[0] == (n = [-1, 0 - cellsInOneRow, 1, cellsInOneRow][(evt || event).keyCode - 37] || direction) ? direction : n;
};
document.addEventListener('touchstart', function (event) {
    var touch = event.targetTouches[0];
    touchStartPosition = {
        x: touch.pageX,
        y: touch.pageY
    };
});
document.body.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });
document.addEventListener('touchend', function (event) {
    var touch = event.changedTouches[0];
    var movedX = touch.pageX - touchStartPosition.x;
    var movedY = touch.pageY - touchStartPosition.y;
    var isScrolling = Math.abs(movedX) < Math.abs(movedY) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
    if (isScrolling) {
        event.preventDefault();
        if (movedY > 20) {
            direction = direction == -20 ? direction : 20; // go down
        } else if (movedY < -20) {
            direction = direction == 20 ? direction : -20; // go up
        }
    } else {
        if (movedX > 20) {
            direction = direction == -1 ? direction : 1; // go right
        } else if (movedX < -20) {
            direction = direction == 1 ? direction : -1; // go left
        }
    }
});
run();

function run() {
    snake.unshift(n = snake[0] + direction); //此时的n为下次蛇头出现的位置，n进入队列
    if (snake.indexOf(n, 1) > 0 || n < 0 || n > 399 || direction == 1 && n % cellsInOneRow == 0 || direction == -1 && n % cellsInOneRow == (cellsInOneRow - 1)) {
        //if语句判断贪吃蛇是否撞到自己或者墙壁，碰到时返回，结束程序
        drawHead(snake[1], snakeSadImg);  
        scoreElement.innerHTML = "游戏结束 - GAME OVER!";
        return;
    }

    var img = n + direction == food ? snakeOpenMouthImg : snakeShutMouthImg;
    draw(n, backgroundColor); // redraw the background
    drawHead(n, img);    // 画出蛇头下次出现的位置
    draw(snake[1], "lime", 10); // redraw the cell used to be the snake head
    if (n == food) {         //如果吃到食物时，产生一个蛇身以外的随机的点，不会去掉蛇尾
        if (score > 0 && score % 10 == 0) {
            var newStar = hiddenStar.cloneNode(true);
            newStar.classList.remove('hidden');
            starSpanElement.appendChild(newStar);

            var gifIndex = (score / 10 - 1) > 11 ? 11 : (score / 10 - 1);
            gifImg.classList.remove('hidden');
            setTimeout(function () {
                gifImg.classList.add('hidden');
                console.log(score);
                console.log(gifIndex);
                gifImg.src = gifs[gifIndex];
            }, 3000)
        }
        scoreElement.innerHTML = "得分 Your Score:" + score++;
        while (snake.indexOf(food = ~~(Math.random() * 400)) > 0);
        draw(food, "yellow", 0);
    } else {                //没有吃到食物时正常移动，蛇尾出队列
        draw(snake.pop(), backgroundColor);
    }
    timeOut = setTimeout(arguments.callee, 200); //每隔0.25秒执行函数一次，可以调节蛇的速度
};

function reset() {
    starSpanElement.innerHTML = "";
    box.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    score = 0;
    snake = [41, 40],       // snake队列表示蛇身，初始节点存在但不显示
    direction = 1,          // 1表示向右，-1表示向左，20表示向下，-20表示向上
    food = 43,              // 食物的位置
    clearTimeout(timeOut);
    run();
}

function drawBackground() {
    box.beginPath();
    box.strokeStyle = "#CCC";
    for (var i = 1; i < 20; i++) {
        box.moveTo(0, cellSizeInPixes * i);
        box.lineTo(800, cellSizeInPixes * i);
        box.moveTo(cellSizeInPixes * i, 0);
        box.lineTo(cellSizeInPixes * i, 800);
    }
    box.stroke();
}

function toggleTheme(element) {
    isDarkTheme = !isDarkTheme;
    if (isDarkTheme) {
        backgroundColor = "gray";
        canvas.classList.add('dark-theme');
    } else {
        backgroundColor = "white";
        canvas.classList.remove('dark-theme');
    }
    for (var i = 0; i < 399; i++) {
        if (snake.indexOf(i) < 0 && i != food) {
            draw(i, backgroundColor);
        }
    }
}