let scoreObject = document.querySelector("h1")
const blockWidth = 100
const blockHeight = 20
const gridWidth = 560
const gridHeight = 300
const ballDiameter = 20
const userStart = [230, 10]
let userCurrentPosition = userStart
const ballStart = [270, 40]
let ballCurrentPosition = ballStart
let xDirection = -2
let yDirection = 2
let timerId
let score = 0

//block 4 points
class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

//array of array of 15 block 
const blocks = [
    new Block(10, 270), //left(in the same line add 110(blockwidth+10 marginleft)),bottom=gridheight-blockheight-marginTop=300-20-10=270
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),

    new Block(10, 240), //line2
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),

    new Block(10, 210),//line 3 
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210)
]

//create block divs
const createBlock = (grid) => {

    for (let i = 0; i < blocks.length; i++) {
        let block = document.createElement("div")
        block.classList.add("block")
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.append(block);
    }
}

//create user div
let user = document.createElement("div")
const createUserBlock = (grid) => {
    user.classList.add("user")
    drawUserBlock()
    grid.append(user)
}

//re-assign user block changing position
const drawUserBlock = () => {
    user.style.left = userCurrentPosition[0] + 'px'
    user.style.bottom = userCurrentPosition[1] + 'px'
}

//move user block div to left and right by keyboard arrows
const moveUserBlock = function (e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (userCurrentPosition[0] > 0) {
                userCurrentPosition[0] -= 10;
                drawUserBlock();
            }
            break;
        case 'ArrowRight':
            if (userCurrentPosition[0] < gridWidth - blockWidth) {
                userCurrentPosition[0] += 10;
                drawUserBlock();
            }
            break;
    }
}
//create ball div
let ball = document.createElement("div")
const createBall = (grid) => {
    ball.classList.add("ball")
    drawBall()
    grid.append(ball)
}

//re-assign ball changing position
const drawBall = () => {
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}

const moveBall = function () {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}

const checkForCollisions = () => {

    //check for blocks collisions
    for (let i = 0; i < blocks.length; i++) {
        if (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
            ballCurrentPosition[1] < blocks[i].topLeft[1] && (ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1]) {
            const allblocks = Array.from(document.querySelectorAll('.block'))
            allblocks[i].classList.remove("block")
            blocks.splice(i, 1)
            changeDirection()
            scoreObject.innerHTML = `Your score is: ${++score}`
            if (blocks.length == 0) {
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUserBlock)
                if (prompt("you won! if you wanna play again enter y") == "y") {
                    location.reload()
                }
                else {
                    scoreObject.innerHTML = 'Congratulations you got them all, you Won!!'
                }
            }
        }
    }

    //check for user blocl collision
    if (ballCurrentPosition[0] > userCurrentPosition[0] && ballCurrentPosition[0] < (userCurrentPosition[0] + 100) &&
        ballCurrentPosition[1] > userCurrentPosition[1] && ballCurrentPosition[1] < (userCurrentPosition[1] + 20)) {
        changeDirection()
    }

    // check for wall hits
    if (ballCurrentPosition[0] >= (gridWidth - ballDiameter) || ballCurrentPosition[0] <= 0 || ballCurrentPosition[1] >= (gridHeight - ballDiameter)) {
        changeDirection()
    }
    //game over
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUserBlock)
        if (prompt("you lost! you wanna try again enter y") == "y") {
            location.reload()
        }
        else {
            scoreObject.innerHTML = 'you lost!'
        }
    }
}
const changeDirection = () => {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2
        return
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2
        return
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2
        return
    }
}
window.addEventListener("load", () => {
    let grid = document.querySelector(".grid")
    createBlock(grid)
    createUserBlock(grid)
    createBall(grid)
    document.addEventListener("keydown", moveUserBlock)
    timerId = setInterval(moveBall, 30)
})