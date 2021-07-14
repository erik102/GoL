var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server);

app.use(express.static("."))

app.get('/', function (req, res) {
    res.redirect('index.html')
})
server.listen(3000)

function generator(matLen, gr, grEat, pr, st, ob) {
    let matrix = [];
    for (let i = 0; i < matLen; i++) {
        matrix[i] = [];
        for (let j = 0; j < matLen; j++) {
            matrix[i][j] = 0;
        }
    }
    for (let i = 0; i < gr; i++) {
        let x = Math.floor(Math.random() * matLen);
        let y = Math.floor(Math.random() * matLen);
        if (matrix[x][y] == 0) {
            matrix[x][y] = 1;
        }
    }
    for (let i = 0; i < grEat; i++) {
        let x = Math.floor(Math.random() * matLen);
        let y = Math.floor(Math.random() * matLen);
        if (matrix[x][y] == 0) {
            matrix[x][y] = 2;
        }
    }
    for (let i = 0; i < pr; i++) {
        let x = Math.floor(Math.random() * matLen);
        let y = Math.floor(Math.random() * matLen);
        if (matrix[x][y] == 0) {
            matrix[x][y] = 3;
        }
    }
    for (let i = 0; i < st; i++) {
        let x = Math.floor(Math.random() * matLen);
        let y = Math.floor(Math.random() * matLen);
        if (matrix[x][y] == 0) {
            matrix[x][y] = 4;
        }
    }
    for (let i = 0; i < ob; i++) {
        let x = Math.floor(Math.random() * matLen);
        let y = Math.floor(Math.random() * matLen);
        if (matrix[x][y] == 0) {
            matrix[x][y] = 5;
        }
    }
    return matrix;
}



matrix = generator(15, 100, 15, 15, 8, 4);

io.sockets.emit('send matrix', matrix)

grassArr = []
grassEaterArr = []
predatorArr = []
stoneArr = []
obyectArr = []

Grass = require("./Grass")
GrassEater = require("./GrassEater")


function createObject(matrix) {
    for (var y = 0; y < matrix.length; ++y) {
        for (var x = 0; x < matrix[y].length; ++x) {
            if (matrix[y][x] == 1) {
                var gr = new Grass(x, y);
                grassArr.push(gr);
            }
            else if (matrix[y][x] == 2) {
                var gr = new GrassEater(x, y);
                grassEaterArr.push(gr);
            }
            else if (matrix[y][x] == 3) {
                var gr = new Predator(x, y);
                predatorArr.push(gr);
            }
            else if (matrix[y][x] == 4) {
                var gr = new Stone(x, y);
                stoneArr.push(gr);
            }
            else if (matrix[y][x] == 5) {
                var gr = new Obyect(x, y);
                obyectArr.push(gr);
            }
        }

    }
    io.sockets.emit('send matrix', matrix)
}

function game() {
    for (var i in grassArr) {
        grassArr[i].mull();
    }

    for (var i in grassEaterArr) {
        grassEaterArr[i].mul();
        grassEaterArr[i].eat();
    }
    for (var i in predatorArr) {
        predatorArr[i].mul();
        predatorArr[i].eat();
    }
    for (var i in obyectArr) {
        obyectArr[i].eat();
    }

    io.sockets.emit("send matrix", matrix);

}

setInterval(game, 1000)

io.on('connection', function (socket) {
    createObject(matrix)
})