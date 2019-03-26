/**
 * 蛇的属性：
 *      和食物大小一样的格子集合(width、height、color)
 * 蛇的行为：
 *      运动(方向)、吃食物(每一个格子都是独立的)
 */
!function (window) {
    var document = window.document,
        map = document.querySelector("#map"),
        // 1.配置蛇的运动方向，用创建对象常量的方式表示
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
        });

    // 2.构造函数中- 定义蛇的属性
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
            color: 'pink'
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
            // 3-3.设置蛇身定位
            div.style.position = "absolute";
            div.style.left = _body.x + 'px';
            div.style.top = _body.y + 'px';
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
        this.elements[0].style.tpo = this.body[0].y + 'px';
    }
    // 5.暴露方向(Direction)和蛇元素(Snake)
    window.Direction = Direction;
    window.Snake = Snake;
}(window);

let snake = new Snake();