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
        Snake = window.Snake,
        Food = window.Food,
        Direction = window.Direction;

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
        var timer = setInterval(() => {
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
            }
        })
    }

    window.Game = Game;

}(window);
