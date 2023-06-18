var mineSweepingMap = function (r, c, num) {
    var map = []
    var row = function (r) {
        for (var i = 0; i < r; i++) {
            map[i] = new Array()
        }
    }

    var column = function (col) {
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < col; j++) {
                map[i][j] = 0
            }
        }
    }

    var blankMap = function (r, col) {
        row(r)
        column(col)
    }

    var writeInMine = function (num) {
        var randomLocation = function () {
            var x = Math.floor(Math.random() * r)
            var y = Math.floor(Math.random() * c)
            if (map[x][y] !== 9) {
                map[x][y] = 9
            } else {
                randomLocation()
            }
        }
        for (var i = 0; i < num; i++) {
            randomLocation()
        }
    }

    var plus = function (array, x, y) {
        if (x >= 0 && x < r && y >= 0 && y < c) {
            if (array[x][y] !== 9) {
                array[x][y] += 1
            }
        }
    }
    var writeInHint = function () {
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (map[x][y] === 9) {
                    for (var i = -1; i < 2; i++) {
                        plus(map, x - 1, y + i)
                        plus(map, x + 1, y + i)
                    }
                    plus(map, x, y + 1)
                    plus(map, x, y - 1)
                }
            }
        }
    }

    blankMap(r, c)
    writeInMine(num)
    writeInHint()
    return map
}

var writeHtml = function (map) {
    var x = document.querySelector('.gameBox')
    for (var i = 0; i < map.length; i++) {
        x.innerHTML = x.innerHTML + `<ul class="row x-${i}" data-x="${i}"></ul>`
    }

    var z = document.querySelectorAll('.row')
    for (var i = 0; i < z.length; i++) {
        for (var j = 0; j < map[0].length; j++) {
            var m = map[i][j]
            if (m === 0) {
                m = ''
            }
            z[i].innerHTML = z[i].innerHTML + `
                <li class="col y-${j} num-${m}" data-y="${j}">
                    <span>${m}</span>
                    <img src="flag.svg" class="img-flag hide">
                </li>`
        }
    }
}

var changeClearMineNum = function (clearMineNum) {
    if (clearMineNum === ((col * row) - num)) {
        var all = document.querySelectorAll('.col')
        var allNum = 0
        var stop = setInterval(function () {
            var r = Math.floor(Math.random() * 256)
            var g = Math.floor(Math.random() * 256)
            var b = 210
            all[allNum].children[0].style.opacity = `0`
            all[allNum].children[1].style.opacity = '0'
            all[allNum].style.background = `rgba(${r},${g},${b},0.6)`
            allNum++
            if (allNum === all.length) {
                clearInterval(stop)
                if (zz === 0) {
                    alert('算你厉害')
                    initializeGame(row, col, num)
                }
                initializeGame(row, col, num)
            }
        }, 20)
    }
}

var clearMine = function (row, col, num) {
    var clearMineNum = 0
    var makeWhite = function (x, y) {
        if (x < row && y < col && x >= 0 && y >= 0) {
            var el = document.querySelector(`.x-${x}`).children[y]
            if (el.style.background !== 'white') {
                el.style.background = 'white'
                el.children[0].style.opacity = '1'
                el.children[1].classList.add('hide')
                clearMineNum++
                changeClearMineNum(clearMineNum)
                if (el.innerText === '') {
                    showNoMine(x, y)
                }
            }
        }
    }
    var showNoMine = function (x, y) {
        makeWhite(x - 1, y + 1)
        makeWhite(x - 1, y - 1)
        makeWhite(x - 1, y)
        makeWhite(x + 1, y + 1)
        makeWhite(x + 1, y - 1)
        makeWhite(x + 1, y)
        makeWhite(x, y + 1)
        makeWhite(x, y - 1)
    }

    var show = function () {
        var x = document.querySelectorAll('.row')
        for (var i = 0; i < x.length; i++) {
            x[i].addEventListener('click', function (event) {
                var el = event.target
                if (el.tagName != 'LI') {
                    el = event.target.parentElement
                }
                var flag = el.children[1].classList.contains('hide')
                if (el.tagName === 'LI' && flag) {
                    if (el.children[0].innerText !== '9' && el.style.background !== 'white') {
                        el.children[0].style.opacity = '1'
                        el.style.background = 'white'
                        clearMineNum++
                        changeClearMineNum(clearMineNum)
                    } else if (el.children[0].innerText === '9') {
                        zz = 1
                        el.classList.add('boom')
                        var all = document.querySelectorAll('.col')
                        var ff = []
                        var allNum = 0
                        for (var i = 0; i < all.length; i++) {
                            if (all[i].children[0].innerText === '9') {
                                ff[allNum] = all[i]
                                allNum++
                            }
                        }
                        allNum = 0
                        var time = 20
                        var stop = setInterval(function () {
                            ff[allNum].classList.add('boom')
                            allNum++
                            if (allNum === ff.length) {
                                clearInterval(stop)
                                alert('寄')
                            }
                        }, time)
                    }
                    if (el.children[0].innerText === '') {
                        var x = parseInt(el.parentElement.dataset.x)
                        var y = parseInt(el.dataset.y)
                        showNoMine(x, y)
                    }
                }
            })
        }
        for (var i = 0; i < x.length; i++) {
            var mineNum = num
            x[i].addEventListener('contextmenu', function (event) {
                event.preventDefault();
                var btnNum = event.button
                var el = event.target
                if (el.tagName != 'LI') {
                    el = event.target.parentElement
                }
                if (el.tagName === 'LI') {
                    var classList = el.children[1].classList
                    if (classList.contains('hide') && el.style.background !== 'white') {
                        var residue = document.querySelector('.residue')
                        if (mineNum !== 0) {
                            mineNum--
                        }
                        residue.innerText = `${mineNum}`
                        classList.remove('hide')
                    } else if (el.style.background !== 'white') {
                        classList.add('hide')
                    }
                }
            })
        }
    }
    show()
}

var stopTime
var initializeGame = function (row, col, num) {
    var residue = document.querySelector('.residue')
    residue.innerText = `${num}`
    var time = document.querySelector('.tick')
    time.innerText = `0`
    var i = 1
    clearInterval(stopTime)
    stopTime = setInterval(function () {
        time.innerText = `${i++}`
    }, 1000)
    zz = 0
    var box = document.querySelector('.gameBox')
    box.innerHTML = ''
    var body = document.querySelector('body')
    body.style.minWidth = `${27 * col}px`
    var map = mineSweepingMap(row, col, num)
    writeHtml(map)
    clearMine(row, col, num)
}

var Btn = function () {
    var level = document.querySelectorAll('.choice-level')
    for (var i = 0; i < level.length; i++) {
        level[i].addEventListener('click', function (event) {
            var level = event.target.innerHTML
            if (level === '初级') {
                row = 9
                col = 9
                num = 10
                initializeGame(row, col, num)
            } else if (level === '中级') {
                row = 16
                col = 16
                num = 40
                initializeGame(row, col, num)
            } else if (level === '高级') {
                row = 16
                col = 30
                num = 99
                initializeGame(row, col, num)
            }
        })
    }
    var restart = document.querySelector('.restart')
    restart.addEventListener('click', function (event) {
        initializeGame(row, col, num)
    })
}
Btn()

var zz = 0
var row = 16
var col = 16
var num = 40
initializeGame(row, col, num)