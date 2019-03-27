/**
 * 整个游戏是一个对象
 *  属性：
 *      1.食物
 *      2.蛇
 *      3.地图
 *  方法：
 *      1.开始游戏
 *      2.游戏结束
 *      3.操作(对蛇的控制)
 */

!function (window) {

    var document = window.document,
        map = document.querySelector("#map"),
        timer = null,
        isStart = true,
        score = 0,
        Direction = Object.create(Object.prototype, {
            TOP: {
                value: 0
            },
            RIGHT: {
                value: 1
            },
            BOTTOM: {
                value: 2
            },
            LEFT: {
                value: 3
            }
        }),
        util = {
            /**
             * 获取随机数
             * @param {最小值} n 
             * @param {最大值} m 
             */
            getRandom: function (n, m) {
                return Math.floor(Math.random() * (m - n) + n)
            }
        };

    function Food(x, y, width, height, color) {
        this.x = x || 0; // x坐标值
        this.y = y || 0; // y坐标值
        this.width = width || 20; //默认值
        this.height = height || 20;
        this.color = color || "green";
        this.init(map); // 初始化食物 - 行为
    };
    Food.prototype.init = function (map) {
        // 1-设置食物的出现范围
        //      随机位置要在地图范围内；
        //      随机位置要在方格子中
        var maxX = map.clientWidth / this.width,
            maxY = map.clientHeight / this.height;
        this.x = util.getRandom(0, maxX) * this.width;
        this.y = util.getRandom(0, maxY) * this.height;

        // 2-生成元素
        var FoodElement = document.createElement('div');
        // 3-设置样式
        FoodElement.style.width = this.width + 'px';
        FoodElement.style.height = this.height + 'px';
        FoodElement.style.backgroundColor = this.color;
        FoodElement.style.position = 'absolute';
        FoodElement.style.left = this.x + 'px';
        FoodElement.style.top = this.y + 'px';
        FoodElement.style.transition = 'all .5s linear';
        // 4-加入页面中
        map.appendChild(FoodElement);
        // 5-关联元素和食物，挂载在Food构造函数上
        this.element = FoodElement;
    }
    // 吃到食物后，原本食物从视图中移除
    Food.prototype.remove = function (map) {
        this.element.className='fade';
        setTimeout(() => {
            map.removeChild(this.element);
        }, 500);
    }

    function Snake(width, height, direction) {
        this.width = width || 20;
        this.height = height || 20;
        this.direction = direction || Direction.RIGHT;
        // 2-1.空数组存储蛇的身体信息
        this.body = [];
        // 2-2.约定 使用索引0作为蛇头，具有位置信息，剩下的是蛇的身体
        this.body[0] = {
            x: 60,
            y: 20,
            color: 'pink',
            zindex: 99
        };
        this.body[1] = {
            x: 40,
            y: 20,
            color: 'skyblue'
        };
        this.body[2] = {
            x: 20,
            y: 20,
            color: 'skyblue'
        };
        // 2-3.需要一个空数组存储body对应的div数组-以更新视图
        this.elements = [];
        this.init(map);
    }

    // 3.prototype原型上-写入蛇的初始化
    Snake.prototype.init = function (map) {
        // 3-1.根据body数组，创建多个div蛇身
        for (let i = 0; i < this.body.length; i++) {
            const _body = this.body[i];
            // 3-2.设置蛇身div样式
            let div = document.createElement("div");
            div.style.width = this.width + 'px';
            div.style.height = this.height + 'px';
            div.style.backgroundColor = _body.color;
            div.style.transition = 'all .2s linear';
            // 3-3.设置蛇身定位
            div.style.position = "absolute";
            div.style.left = _body.x + 'px';
            div.style.top = _body.y + 'px';
            div.style.zIndex = _body.zindex ? _body.zindex : 1;
            // 3-4.将蛇追加到页面中
            map.appendChild(div);
            // 3-5.每次创建一个蛇身元素 就追加进body数组中 方便后期调用
            this.elements.push(div);
        }
    }

    // 4.prototype原型上- 写入蛇移动的方法
    Snake.prototype.move = function () {
        // 4-1.每一次 后一个格的信息都赋值为前一格的信息
        //       也就是修改每一个格子的x、y的信息
        for (var i = this.body.length - 1; i > 0; i--) {
            let currentBody = this.body[i];
            let prevBody = this.body[i - 1];
            currentBody.x = prevBody.x;
            currentBody.y = prevBody.y;
            // 4-1-1.同部到元素element数组中
            this.elements[i].style.left = currentBody.x + 'px';
            this.elements[i].style.top = currentBody.y + 'px';
        }
        // 4-2.根据方向让蛇头移动 - 根据蛇当前方向来移动
        switch (this.direction) {
            case Direction.TOP:
                this.body[0].y -= this.height;
                break;
            case Direction.RIGHT:
                this.body[0].x += this.width;
                break;
            case Direction.BOTTOM:
                this.body[0].y += this.height;
                break;
            case Direction.LEFT:
                this.body[0].x -= this.width;
                break;
        }
        // 4-3.同步页面元素
        this.elements[0].style.left = this.body[0].x + 'px';
        this.elements[0].style.top = this.body[0].y + 'px';
    }

    // 5.蛇吃到食物变长的逻辑
    Snake.prototype.growth = function (map) {
        // 5-1.新生的身体部分和最后一个格子的属性一模一样
        var lastBody = this.body[this.body.length - 1];
        var lastBodyObj = {
            x: lastBody.x,
            y: lastBody.y,
            color: lastBody.color
        }
        this.body.push(lastBodyObj); // 将这新增的部分同部到body元素中
        var div = document.createElement("div");
        div.style.width = this.width + 'px';
        div.style.height = this.height + 'px';
        div.style.backgroundColor = lastBodyObj.color;
        div.style.position = 'absolute';
        div.style.left = lastBody.x + 'px';
        div.style.top = lastBody.y + 'px';
        map.appendChild(div); // 更新视图
        this.elements.push(div); // 同部到dom元素数组中
    }

    function Game() {
        // 绑上三个属性
        this.food = new Food();
        this.snake = new Snake();
        this.map = map;
        // 一、开始游戏
        this.start();
        // 二、控制操作
        this.bindKey();
    }

    // 1.开始游戏
    Game.prototype.start = function () {
        // var _this = this;
        timer = setInterval(() => {
            this.snake.move();
            // 1-1.判断蛇是否超出边界
            var head = this.snake.body[0];
            if (head.x < 0
                || head.x > this.map.offsetWidth - this.food.width
                || head.y < 0
                || head.y > this.map.offsetHeight - this.food.height
            ) {
                clearInterval(timer);
                alert('GAME OVER!');
            }
            // 1-2.蛇碰到自己身体的逻辑
            for (var i = 1; i < this.snake.body.length; i++) {
                var currentBody = this.snake.body[i];
                if (currentBody.x == head.x && currentBody.y == head.y) {
                    clearInterval(timer);
                    alert('GAME OVER!');
                }
            }
            // 1-3.蛇吃到食物的逻辑
            if (head.x === this.food.x && head.y === this.food.y) {
                this.food.remove(this.map); // 清除食物
                this.snake.growth(this.map); // 蛇增长一格子
                this.food = new Food(); // 生成新的食物
                score++;
            }
        }, 200);
    }
    // 2.操作控制
    Game.prototype.bindKey = function () {
        // 1.给dom绑定按钮事件，根据不同的案件修改蛇的移动方向
        document.addEventListener('keydown', (e) => {
            /**
             * 37← || 38↑  || 39→ || 40↓
             */
            switch (e.keyCode) {
                case 37:
                    this.snake.direction = Direction.LEFT
                    break;
                case 38:
                    this.snake.direction = Direction.TOP
                    break;
                case 39:
                    this.snake.direction = Direction.RIGHT
                    break;
                case 40:
                    this.snake.direction = Direction.BOTTOM
                    break;
                case 32:
                    isStart ? this.pause() : this.start();
                    isStart = !isStart;
                    break;
            }
        })
    }
    // 3.暂停操作
    Game.prototype.pause = function () {
        clearInterval(timer);
    }

    window.Game = Game;

}(window);
